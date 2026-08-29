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


def _build_client(proxy: str = "") -> Client:
    client = Client()
    # Space requests out a little; the private API is stricter about bursts.
    client.delay_range = [1, 3]
    if proxy:
        client.set_proxy(proxy)
        log.info("Instagram: routing requests through the configured proxy")
    return client


def _decode_session_blob(blob: str) -> Optional[dict]:
    """Read the base64 settings blob handed in through IG_SESSION."""
    try:
        return json.loads(base64.b64decode(blob).decode("utf-8"))
    except Exception as exc:
        log.warning("Instagram: IG_SESSION is not a valid base64 settings blob (%s)", exc)
        return None


def _cached_settings(username: str, session_cache, session_blob: str) -> List[tuple[dict, str]]:
    """
    Every stored session worth trying, best first.

    MongoDB is the live copy - it is rewritten after each successful run, so it
    tracks the cookies and claims Instagram rotates. IG_SESSION is the bootstrap:
    a session minted on a trusted device, mirrored into a repository secret. Both
    are returned because the live copy is the one that goes stale, and falling
    back to the secret is the difference between a self-healing run and a
    password login that CI cannot complete.
    """
    candidates: List[tuple[dict, str]] = []
    if session_cache is not None:
        try:
            raw = session_cache.load_session(username)
            if raw:
                candidates.append((json.loads(raw.decode("utf-8")), "database"))
        except Exception as exc:
            log.warning("Instagram: could not read the cached session (%s)", exc)

    if session_blob:
        settings = _decode_session_blob(session_blob)
        if settings:
            candidates.append((settings, "IG_SESSION"))

    return candidates


def _persist_settings(client: Client, username: str, session_cache) -> None:
    """
    Write the current settings back after every successful authentication.

    Instagram hands back a new `mid` and `rur` cookie as the session is used,
    and there is no expiry to refresh ahead of - a session dies from a security
    event, not from age. Saving only after a fresh login, as this used to, meant
    a session that Instagram had quietly re-keyed was never written back, and
    the next run fell through to the password login that CI can never complete.
    """
    if session_cache is None:
        return
    try:
        session_cache.save_session(username, json.dumps(client.get_settings()).encode("utf-8"))
    except Exception as exc:
        log.warning("Instagram: could not cache the session (%s)", exc)


def _session_is_live(client: Client) -> bool:
    """
    Check a restored session with a single authenticated request.

    Deliberately not `client.login()`: instagrapi's login() silently escalates a
    rejected session into a full password login, which is exactly the request
    Instagram checkpoints from a datacenter IP. Validating has to be a plain API
    call so the caller decides whether a password login is even permitted.
    """
    if not client.user_id:
        log.warning("Instagram: the stored settings carry no session id")
        return False
    try:
        client.account_info()
        return True
    except Exception as exc:
        log.warning("Instagram: the stored session was rejected (%s)", exc)
        return False


def _authenticate(
    client: Client,
    username: str,
    password: str,
    session_cache=None,
    *,
    session_blob: str = "",
    allow_password_login: bool = True,
    totp_secret: str = "",
) -> bool:
    """
    Authenticate from a stored session, falling back to a password login only
    where that can actually succeed.

    Instagram treats repeated logins as suspicious, and answers a password login
    from a datacenter IP with a `challenge_required` checkpoint that only a human
    on a trusted device can clear. An unattended job therefore cannot log in - it
    can only reuse a session someone minted interactively. Reusing stored
    settings also keeps the device fingerprint stable, which is itself a signal
    Instagram acts on.
    """
    if not username:
        log.error("Instagram: IG_USERNAME is required")
        return False

    candidates = _cached_settings(username, session_cache, session_blob)
    if not candidates:
        log.warning("Instagram: no stored session found for @%s", username)
    for settings, source in candidates:
        client.set_settings(settings)
        if _session_is_live(client):
            log.info("Instagram: reusing the cached session (%s) for @%s", source, username)
            # Promotes a working IG_SESSION into the database copy as a side
            # effect, so the secret is only ever needed once.
            _persist_settings(client, username, session_cache)
            return True
        log.warning("Instagram: the %s session is not usable", source)

    if not allow_password_login:
        log.error(
            "Instagram: no usable session and password logins are disabled here. "
            "Instagram challenges password logins from CI runners, so mint a new "
            "session on a trusted machine with `python backend/seed_ig_session.py` "
            "and re-run this job."
        )
        # The stored session stays put. It may still work from a residential IP,
        # and deleting it would strand the seed script's device fingerprint too.
        return False

    if not password:
        log.error("Instagram: IG_PASSWORD is required to log in without a stored session")
        return False

    verification_code = ""
    if totp_secret:
        try:
            verification_code = client.totp_generate_code(totp_secret)
        except Exception as exc:
            log.warning("Instagram: could not derive a TOTP code (%s)", exc)

    try:
        # relogin keeps the device identifiers from the rejected session; a brand
        # new device on a known account is more suspicious than a stale cookie.
        client.login(username, password, relogin=bool(candidates), verification_code=verification_code)
        log.info("Instagram: logged in as %s", username)
    except Exception as exc:
        log.error("Instagram: login failed for @%s (%s)", username, exc)
        return False

    _persist_settings(client, username, session_cache)
    log.info("Instagram: cached the session for reuse on the next run")
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
    *,
    session_blob: str = "",
    allow_password_login: bool = True,
    totp_secret: str = "",
    proxy: str = "",
) -> List[ScrapedPost]:
    client = _build_client(proxy)
    if not _authenticate(
        client,
        username,
        password,
        session_cache,
        session_blob=session_blob,
        allow_password_login=allow_password_login,
        totp_secret=totp_secret,
    ):
        raise RuntimeError(
            "Could not authenticate with Instagram. The private API needs a session "
            "minted on a trusted device: run `python backend/seed_ig_session.py` "
            "locally, then re-run this job."
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
