"""End-to-end sync: scrape -> classify (image + text) -> diff -> persist."""
from __future__ import annotations

import logging
from typing import Dict, List, Optional

from . import config as cfg
from .classify import PROMPT_VERSION, classify_posts, select_events
from .config import Config
from .instagram import (
    ScrapedPost,
    download_bytes,
    encode_classify_image,
    encode_storage_image,
    fetch_recent_posts,
)
from .store import Store, build_document, content_hash, image_hash

log = logging.getLogger(__name__)


def _verdict_key(post: ScrapedPost) -> str:
    """
    A post keeps its verdict until its caption changes - or until the classifier
    prompt changes, since a verdict is only meaningful under the rules that
    produced it.
    """
    return f"{post.shortcode}:{post.caption_fingerprint()}:{PROMPT_VERSION}"


def _reusable_image(existing: Optional[dict], post: ScrapedPost) -> Optional[dict]:
    """
    Reuse the stored image when we already have this post and its caption has
    not changed. Instagram re-encodes CDN media over time, so re-downloading
    every night would produce fresh bytes, a fresh hash, and a pointless write.
    """
    if not existing or not existing.get("image") or not existing.get("imageHash"):
        return None
    if existing.get("caption") != post.caption:
        return None
    image = existing["image"]
    return {
        "bytes": bytes(image["data"]),
        "meta": {
            "width": image.get("width", 0),
            "height": image.get("height", 0),
            "hash": existing["imageHash"],
        },
    }


def run(config: Config) -> int:
    # Opened before the scrape because it doubles as the Instagram session cache.
    with Store(
        config.mongodb_uri,
        config.mongodb_db,
        cfg.POSTS_COLLECTION,
        cfg.META_COLLECTION,
        cfg.CLASSIFIED_COLLECTION,
    ) as store:
        posts = fetch_recent_posts(
            profile=config.ig_profile,
            count=cfg.FETCH_COUNT,
            username=config.ig_username,
            password=config.ig_password,
            session_cache=store,
            session_blob=config.ig_session,
            allow_password_login=config.ig_allow_password_login,
            totp_secret=config.ig_totp_secret,
            proxy=config.ig_proxy,
        )
        if not posts:
            log.error("No posts scraped from @%s; leaving the database untouched", config.ig_profile)
            return 1

        existing = store.existing_by_id()
        cached = store.cached_verdicts()

        # Only unseen posts cost a download and a vision call. In the steady
        # state that is however many things USB posted since yesterday.
        pending = [p for p in posts if _verdict_key(p) not in cached]
        log.info("%d post(s) need classifying, %d cached", len(pending), len(posts) - len(pending))

        raw_images: Dict[str, bytes] = {}
        classify_images: Dict[str, str] = {}
        for post in pending:
            raw = download_bytes(post.image_url)
            if raw is None:
                continue
            raw_images[post.shortcode] = raw
            data_url = encode_classify_image(raw, cfg.CLASSIFY_IMAGE_DIM, cfg.CLASSIFY_IMAGE_QUALITY)
            if data_url:
                classify_images[post.shortcode] = data_url

        fresh = classify_posts(
            posts=pending,
            images=classify_images,
            api_key=config.groq_api_key,
            model=config.groq_model,
            batch_size=cfg.VISION_BATCH_SIZE,
            batch_pause=cfg.VISION_BATCH_PAUSE,
            max_retries=cfg.VISION_MAX_RETRIES,
            max_tokens=cfg.VISION_MAX_TOKENS,
            reasoning_effort=cfg.VISION_REASONING_EFFORT,
        )

        verdicts = {p.shortcode: cached[_verdict_key(p)] for p in posts if _verdict_key(p) in cached}
        verdicts.update(fresh)

        # Guard against publishing a downgrade. The heuristic exists so the site
        # still renders something when Groq is unreachable - not so that a failed
        # run can replace real titles and dates with blanks.
        if fresh:
            by_llm = sum(1 for v in fresh.values() if v.get("source") == "groq")
            coverage = by_llm / len(fresh)
            if coverage < cfg.MIN_LLM_COVERAGE and config.allow_heuristic:
                log.warning(
                    "--allow-heuristic: writing with only %d/%d model verdict(s). "
                    "Events will have no titles or dates until a full run succeeds.",
                    by_llm, len(fresh),
                )
            if coverage < cfg.MIN_LLM_COVERAGE and existing and not config.allow_heuristic:
                log.error(
                    "Only %d/%d post(s) were classified by %s (%.0f%%, need %.0f%%). "
                    "Leaving the database as is rather than overwriting it with "
                    "caption-only guesses.",
                    by_llm, len(fresh), config.groq_model,
                    coverage * 100, cfg.MIN_LLM_COVERAGE * 100,
                )
                # Keep whatever verdicts the model did produce, so a later run
                # does not pay for them again.
                store.save_verdicts({_verdict_key(p): fresh[p.shortcode]
                                     for p in posts
                                     if p.shortcode in fresh
                                     and fresh[p.shortcode].get("source") == "groq"})
                return 1

        selection = select_events(posts, verdicts, cfg.EVENT_COUNT)
        if not selection:
            log.error("No event posts identified; leaving the database untouched")
            return 1

        by_id = {p.shortcode: p for p in posts}
        docs: List[dict] = []
        downloaded = 0

        for rank, item in enumerate(selection):
            post = by_id.get(item["id"])
            if post is None:
                continue

            reuse = _reusable_image(existing.get(post.shortcode), post)
            if reuse:
                image_bytes, image_meta = reuse["bytes"], reuse["meta"]
            else:
                raw = raw_images.get(post.shortcode) or download_bytes(post.image_url)
                encoded = encode_storage_image(raw, cfg.IMAGE_MAX_DIM, cfg.IMAGE_QUALITY) if raw else None
                if encoded is None:
                    log.warning("Skipping %s: image could not be fetched", post.shortcode)
                    continue
                data, width, height = encoded
                image_bytes = data
                image_meta = {"width": width, "height": height, "hash": image_hash(data)}
                downloaded += 1

            docs.append(
                build_document(
                    post=post,
                    rank=rank,
                    title=item.get("title"),
                    event_date=item.get("event_date"),
                    image_bytes=image_bytes,
                    image_meta=image_meta,
                )
            )

        if not docs:
            log.error("Every selected post failed to build; leaving the database untouched")
            return 1

        new_hash = content_hash(docs)
        unchanged = new_hash == store.stored_content_hash()

        if config.dry_run:
            log.info("DRY_RUN: would write %d post(s), hash %s%s",
                     len(docs), new_hash[:12], " (unchanged)" if unchanged else "")
            for d in docs:
                log.info("  [%d] %s - %s (%s)", d["rank"], d["_id"],
                         d.get("eventTitle") or "(untitled)", d.get("eventDate") or "no date")
            return 0

        # Cache only what the model actually decided. Heuristic verdicts are a
        # rendering fallback, not a judgement worth remembering - caching them
        # would mark the post "already classified" and stop the model from ever
        # looking at it, permanently freezing in a caption-only guess.
        store.save_verdicts({
            _verdict_key(by_id[pid]): v
            for pid, v in fresh.items()
            if pid in by_id and v.get("source") == "groq"
        })

        if unchanged:
            log.info("No changes since last sync (%s); database left as is", new_hash[:12])
            return 0

        store.ensure_indexes()
        store.replace_all(
            docs,
            new_hash,
            {
                "profile": config.ig_profile,
                "model": config.groq_model,
                "postsConsidered": len(posts),
                "postsClassified": len(fresh),
                "imagesDownloaded": downloaded,
            },
        )
        log.info("Sync complete: %d event post(s), hash %s", len(docs), new_hash[:12])
        return 0
