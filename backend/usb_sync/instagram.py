"""Fetch recent posts from a public Instagram profile.

Uses instagrapi (Instagram's private mobile API) rather than Instaloader.
Instaloader lists posts exclusively through the web GraphQL endpoint, and
Instagram returns a blanket 401 there for scraper-ish accounts - including for
the account's own timeline - while the mobile endpoints keep answering normally.
Instaloader's profile lookup is separately broken for @purdueusb, whose
professional-account metadata trips a server-side schema error.
"""
from __future__ import annotations

import base64
import hashlib
import io
import json
import logging
from dataclasses import dataclass
from datetime import timezone
from typing import List, Optional

import requests
from instagrapi import Client
from instagrapi.types import Media
from PIL import Image

log = logging.getLogger(__name__)

# instagrapi media_type values
PHOTO, VIDEO, ALBUM = 1, 2, 8


@dataclass
class ScrapedPost:
    shortcode: str
    caption: str
    timestamp: str  # ISO-8601, UTC
    permalink: str
    image_url: str
    is_video: bool
    likes: int

    def caption_fingerprint(self) -> str:
        """Identifies a post's text so an edited caption invalidates its verdict."""
        return hashlib.sha256(self.caption.encode("utf-8")).hexdigest()[:16]

    def summary_for_llm(self) -> str:
        # Long captions add cost without improving the judgement.
        caption = self.caption[:1200] or "(no caption)"
        return (
            f"post_id: {self.shortcode}\n"
            f"posted_at: {self.timestamp}\n"
            f"caption: {caption}"
        )


def _build_client() -> Client:
    client = Client()
    # Space requests out a little; the private API is stricter about bursts.
    client.delay_range = [1, 3]
    return client


def _authenticate(client: Client, username: str, password: str, session_cache=None) -> bool:
    """
    Authenticate, preferring a cached session over a fresh login.

    Instagram treats repeated logins as suspicious, and an unattended nightly job
    would otherwise log in from scratch every single day. Reusing stored settings
    (device identifiers plus cookies) turns that into roughly one login per
    session lifetime, and keeps the device fingerprint stable - a changing device
    is itself a signal Instagram acts on.
    """
    if not username or not password:
        log.error("Instagram: IG_USERNAME and IG_PASSWORD are both required")
        return False

    cached = None
    if session_cache is not None:
        try:
            blob = session_cache.load_session(username)
            if blob:
                cached = json.loads(blob.decode("utf-8"))
        except Exception as exc:
            log.warning("Instagram: could not read the cached session (%s)", exc)

    if cached:
        try:
            client.set_settings(cached)
            client.login(username, password)
            client.get_timeline_feed()  # cheap call that fails on a dead session
            log.info("Instagram: reusing cached session for %s", username)
            return True
        except Exception as exc:
            log.info("Instagram: cached session unusable (%s); logging in fresh", exc)
            client.set_settings({})
            try:
                session_cache.clear_session()
            except Exception:
                pass

    try:
        client.login(username, password)
        log.info("Instagram: logged in as %s", username)
    except Exception as exc:
        log.error("Instagram: login failed for @%s (%s)", username, exc)
        return False

    if session_cache is not None:
        try:
            session_cache.save_session(username, json.dumps(client.get_settings()).encode("utf-8"))
            log.info("Instagram: cached the session for reuse on the next run")
        except Exception as exc:
            log.warning("Instagram: could not cache the session (%s)", exc)
    return True


def _still_image_url(media: Media) -> Optional[str]:
    """
    The flyer image for a post, or None if the post is video-based.

    Videos and Reels are excluded outright rather than left to the classifier.
    A video's thumbnail is an arbitrary frame, not a designed graphic, and the
    model reads whatever text happens to be in it - one Reel of security-camera
    footage got picked as an event with its burned-in timecode ("TCR 10-09")
    parsed as the event date. Only real flyers should reach classification.

    Carousels keep their pages in `resources` and often carry no top-level
    thumbnail, so take the first page that is actually a photo.
    """
    product_type = (getattr(media, "product_type", "") or "").lower()
    if media.media_type == VIDEO or product_type in {"clips", "igtv"}:
        return None

    if media.media_type == ALBUM:
        for resource in media.resources or []:
            if resource.media_type == PHOTO and resource.thumbnail_url:
                return str(resource.thumbnail_url)
        return None  # an all-video carousel

    if media.media_type == PHOTO and media.thumbnail_url:
        return str(media.thumbnail_url)
    return None


def fetch_recent_posts(
    profile: str,
    count: int,
    username: str = "",
    password: str = "",
    session_cache=None,
    overscan: int = 2,
) -> List[ScrapedPost]:
    client = _build_client()
    if not _authenticate(client, username, password, session_cache):
        raise RuntimeError(
            "Could not authenticate with Instagram. The private API requires a login; "
            "check IG_USERNAME / IG_PASSWORD and that the account has no 2FA or "
            "pending security challenge."
        )

    user_id = client.user_id_from_username(profile)
    # user_medias_v1 is the private-API path. The plain user_medias() can fall
    # back to GraphQL, which is exactly the endpoint that 401s for us.
    #
    # Over-fetch, because videos get dropped below: we still want `count` real
    # flyer posts to choose from, not `count` minus however many Reels USB
    # happened to post recently.
    medias = client.user_medias_v1(user_id, count * overscan)

    posts: List[ScrapedPost] = []
    skipped_video = 0
    for media in medias:
        image_url = _still_image_url(media)
        if not image_url:
            skipped_video += 1
            continue
        taken = media.taken_at
        if taken.tzinfo is None:
            taken = taken.replace(tzinfo=timezone.utc)
        posts.append(
            ScrapedPost(
                shortcode=media.code,
                caption=media.caption_text or "",
                timestamp=taken.astimezone(timezone.utc).isoformat().replace("+00:00", "Z"),
                permalink=f"https://www.instagram.com/p/{media.code}/",
                image_url=image_url,
                is_video=False,  # videos never get this far
                likes=media.like_count or 0,
            )
        )

    # Instagram returns pinned posts first, so the feed order is not chronological.
    # Sort before truncating, or a genuinely newer post sitting further down the
    # response would be cut in favour of an older pinned one.
    posts.sort(key=lambda p: p.timestamp, reverse=True)
    posts = posts[:count]

    log.info(
        "Instagram: fetched %d image post(s) from @%s (skipped %d video/Reel post(s))",
        len(posts), profile, skipped_video,
    )
    if len(posts) < count:
        log.warning(
            "Only %d image post(s) available from the %d most recent; consider raising overscan",
            len(posts), count * overscan,
        )
    return posts


def download_bytes(url: str) -> Optional[bytes]:
    """Fetch the raw image once; callers derive every size they need from it."""
    try:
        resp = requests.get(url, timeout=30)
        resp.raise_for_status()
        return resp.content
    except Exception as exc:
        log.error("Failed to download image %s: %s", url, exc)
        return None


def encode_storage_image(raw: bytes, max_dim: int, quality: int) -> Optional[tuple[bytes, int, int]]:
    """The copy that goes into MongoDB and is served to browsers. Returns (bytes, w, h)."""
    try:
        img = Image.open(io.BytesIO(raw)).convert("RGB")
        img.thumbnail((max_dim, max_dim), Image.LANCZOS)
        out = io.BytesIO()
        img.save(out, format="WEBP", quality=quality, method=5)
        return out.getvalue(), img.width, img.height
    except Exception as exc:
        log.error("Failed to encode storage image: %s", exc)
        return None


def encode_classify_image(raw: bytes, max_dim: int, quality: int) -> Optional[str]:
    """
    Smaller JPEG data URL for the vision model. JPEG rather than WebP because it
    is the format every provider accepts, and small enough to stay inside Groq's
    request ceiling - while still leaving flyer text legible, which is the whole
    point of showing it the image.
    """
    try:
        img = Image.open(io.BytesIO(raw)).convert("RGB")
        img.thumbnail((max_dim, max_dim), Image.LANCZOS)
        out = io.BytesIO()
        img.save(out, format="JPEG", quality=quality, optimize=True)
        return f"data:image/jpeg;base64,{base64.b64encode(out.getvalue()).decode('ascii')}"
    except Exception as exc:
        log.error("Failed to encode classification image: %s", exc)
        return None
