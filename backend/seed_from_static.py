#!/usr/bin/env python3
"""
Seed MongoDB from the checked-in posts in frontend/public/Instagram Posts.

Everything downstream of the scrape is the real pipeline: the same Groq vision
classifier, the same WebP encoding, the same content hash and the same writes.
Only the source of the posts differs, so the documents this produces are
indistinguishable from a live sync - which means the first successful
run_sync.py simply replaces them.

    python backend/seed_from_static.py [--dry-run]

Useful for standing the database up before Instagram scraping works, and for
re-seeding a fresh Atlas cluster.
"""
from __future__ import annotations

import argparse
import json
import logging
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from usb_sync import config as cfg  # noqa: E402
from usb_sync.classify import PROMPT_VERSION, classify_posts, select_events  # noqa: E402
from usb_sync.config import Config, ConfigError  # noqa: E402
from usb_sync.instagram import ScrapedPost, encode_classify_image, encode_storage_image  # noqa: E402
from usb_sync.store import Store, build_document, content_hash, image_hash  # noqa: E402

log = logging.getLogger("seed")

FRONTEND_PUBLIC = Path(__file__).resolve().parents[1] / "frontend" / "public"
POSTS_JSON = FRONTEND_PUBLIC / "Instagram Posts" / "insta_posts.json"


def _shortcode(permalink: str, fallback: str) -> str:
    """
    Use the real Instagram shortcode as the document id so these rows line up
    with what the scraper will later produce, rather than seeding ids that can
    never match.
    """
    match = re.search(r"/p/([A-Za-z0-9_-]+)", permalink or "")
    return match.group(1) if match else fallback


def load_static_posts() -> list[tuple[ScrapedPost, bytes]]:
    raw = json.loads(POSTS_JSON.read_text())
    out: list[tuple[ScrapedPost, bytes]] = []
    for item in raw:
        image_path = FRONTEND_PUBLIC / str(item.get("imageUrl", "")).lstrip("/")
        if not image_path.is_file():
            log.warning("Skipping %s: image not found at %s", item.get("id"), image_path)
            continue
        post = ScrapedPost(
            shortcode=_shortcode(item.get("permalink", ""), str(item.get("id"))),
            caption=item.get("caption", ""),
            timestamp=item.get("timestamp", ""),
            permalink=item.get("permalink", ""),
            image_url="",  # local file, nothing to download
            is_video=False,
            likes=0,
        )
        out.append((post, image_path.read_bytes()))
    # newest first, matching what Instagram returns
    out.sort(key=lambda pair: pair[0].timestamp, reverse=True)
    return out


def main() -> int:
    parser = argparse.ArgumentParser(description="Seed MongoDB from the checked-in posts.")
    parser.add_argument("--dry-run", action="store_true", help="do everything except write")
    args = parser.parse_args()

    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)-7s %(name)s: %(message)s",
                        datefmt="%H:%M:%S")
    try:
        config = Config.from_env(dry_run=args.dry_run)
    except ConfigError as exc:
        log.error("%s", exc)
        return 2

    pairs = load_static_posts()
    if not pairs:
        log.error("No usable posts found in %s", POSTS_JSON)
        return 1
    log.info("Loaded %d checked-in post(s)", len(pairs))

    posts = [p for p, _ in pairs]
    raw_images = {p.shortcode: blob for p, blob in pairs}

    classify_images = {}
    for shortcode, blob in raw_images.items():
        data_url = encode_classify_image(blob, cfg.CLASSIFY_IMAGE_DIM, cfg.CLASSIFY_IMAGE_QUALITY)
        if data_url:
            classify_images[shortcode] = data_url

    verdicts = classify_posts(
        posts=posts,
        images=classify_images,
        api_key=config.groq_api_key,
        model=config.groq_model,
        batch_size=cfg.VISION_BATCH_SIZE,
        batch_pause=cfg.VISION_BATCH_PAUSE,
        max_retries=cfg.VISION_MAX_RETRIES,
        max_tokens=cfg.VISION_MAX_TOKENS,
        reasoning_effort=cfg.VISION_REASONING_EFFORT,
    )

    selection = select_events(posts, verdicts, cfg.EVENT_COUNT)
    if not selection:
        log.error("Classifier marked none of the checked-in posts as events")
        return 1

    by_id = {p.shortcode: p for p in posts}
    docs = []
    for rank, item in enumerate(selection):
        post = by_id[item["id"]]
        encoded = encode_storage_image(raw_images[post.shortcode], cfg.IMAGE_MAX_DIM, cfg.IMAGE_QUALITY)
        if encoded is None:
            log.warning("Skipping %s: image could not be encoded", post.shortcode)
            continue
        data, width, height = encoded
        docs.append(
            build_document(
                post=post,
                rank=rank,
                title=item.get("title"),
                event_date=item.get("event_date"),
                image_bytes=data,
                image_meta={"width": width, "height": height, "hash": image_hash(data)},
            )
        )

    if not docs:
        log.error("No documents could be built")
        return 1

    new_hash = content_hash(docs)
    print()
    for d in docs:
        print(f"  [{d['rank']}] {d['_id']:14} {d.get('eventTitle') or '(untitled)':28} "
              f"{d.get('eventDate') or 'no date':12} {d['image']['bytes'] // 1024}KB")
    print()

    if config.dry_run:
        log.info("DRY_RUN: would write %d post(s), hash %s", len(docs), new_hash[:12])
        return 0

    with Store(config.mongodb_uri, config.mongodb_db, cfg.POSTS_COLLECTION,
               cfg.META_COLLECTION, cfg.CLASSIFIED_COLLECTION) as store:
        store.ensure_indexes()
        store.save_verdicts({f"{pid}:{by_id[pid].caption_fingerprint()}:{PROMPT_VERSION}": v
                             for pid, v in verdicts.items() if pid in by_id})
        store.replace_all(docs, new_hash, {
            "profile": config.ig_profile,
            "model": config.groq_model,
            "postsConsidered": len(posts),
            "source": "seed_from_static",
        })
    log.info("Seeded %d event post(s), hash %s", len(docs), new_hash[:12])
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
