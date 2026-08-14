"""MongoDB persistence for the selected Instagram event posts."""
from __future__ import annotations

import hashlib
import logging
from datetime import datetime, timezone
from typing import Dict, List, Optional

from bson import Binary
from pymongo import MongoClient, ReplaceOne
from pymongo.errors import PyMongoError

log = logging.getLogger(__name__)

META_ID = "instagram_state"
SESSION_ID = "instagram_session"


class Store:
    def __init__(
        self,
        uri: str,
        db_name: str,
        posts_collection: str,
        meta_collection: str,
        classified_collection: str,
    ):
        self._client = MongoClient(uri, serverSelectionTimeoutMS=20000, appname="usb-instagram-sync")
        db = self._client[db_name]
        self.posts = db[posts_collection]
        self.meta = db[meta_collection]
        self.classified = db[classified_collection]

    def close(self) -> None:
        self._client.close()

    def __enter__(self) -> "Store":
        return self

    def __exit__(self, *_exc) -> None:
        self.close()

    def ensure_indexes(self) -> None:
        self.posts.create_index("rank")
        self.posts.create_index("imageHash")

    def existing_by_id(self) -> Dict[str, dict]:
        return {doc["_id"]: doc for doc in self.posts.find({})}

    def stored_content_hash(self) -> Optional[str]:
        doc = self.meta.find_one({"_id": META_ID})
        return doc.get("contentHash") if doc else None

    # --- Instagram session -----------------------------------------------
    # Logging in fresh on every run is itself a spam signal to Instagram, and a
    # nightly job would do it 365 times a year. Caching the session here means
    # one login per session lifetime instead, without putting a session blob in
    # the environment: it is internal state, not configuration.

    def load_session(self, username: str) -> Optional[bytes]:
        doc = self.meta.find_one({"_id": SESSION_ID})
        # A changed IG_USERNAME must not silently reuse the old account's session.
        if not doc or doc.get("username") != username or not doc.get("data"):
            return None
        return bytes(doc["data"])

    def save_session(self, username: str, blob: bytes) -> None:
        self.meta.replace_one(
            {"_id": SESSION_ID},
            {
                "_id": SESSION_ID,
                "username": username,
                "data": Binary(blob),
                "savedAt": datetime.now(timezone.utc),
            },
            upsert=True,
        )

    def clear_session(self) -> None:
        self.meta.delete_one({"_id": SESSION_ID})

    def cached_verdicts(self) -> Dict[str, dict]:
        """
        Past classifications, keyed "<shortcode>:<caption fingerprint>". Sending
        a post to the model once and remembering the answer is what keeps the
        nightly run from re-judging the same 20 posts and rewriting the
        collection whenever the model phrases a title differently.
        """
        return {doc["_id"]: doc for doc in self.classified.find({})}

    def save_verdicts(self, verdicts: Dict[str, dict]) -> None:
        if not verdicts:
            return
        now = datetime.now(timezone.utc)
        self.classified.bulk_write(
            [
                ReplaceOne({"_id": key}, {"_id": key, **verdict, "classifiedAt": now}, upsert=True)
                for key, verdict in verdicts.items()
            ],
            ordered=False,
        )

    def replace_all(self, docs: List[dict], content_hash: str, extra_meta: dict) -> None:
        ids = [d["_id"] for d in docs]
        self.posts.bulk_write(
            [ReplaceOne({"_id": d["_id"]}, d, upsert=True) for d in docs],
            ordered=False,
        )
        removed = self.posts.delete_many({"_id": {"$nin": ids}}).deleted_count
        self.meta.replace_one(
            {"_id": META_ID},
            {
                "_id": META_ID,
                "contentHash": content_hash,
                "syncedAt": datetime.now(timezone.utc),
                "postCount": len(docs),
                **extra_meta,
            },
            upsert=True,
        )
        log.info("Mongo: wrote %d post(s), removed %d stale", len(docs), removed)


def image_hash(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()[:32]


def build_document(
    *,
    post,
    rank: int,
    title: Optional[str],
    event_date: Optional[str],
    image_bytes: Optional[bytes],
    image_meta: Optional[dict],
) -> dict:
    doc = {
        "_id": post.shortcode,
        "shortcode": post.shortcode,
        "caption": post.caption,
        "timestamp": post.timestamp,
        "permalink": post.permalink,
        "eventTitle": title,
        "eventDate": event_date,
        "isVideo": post.is_video,
        "likes": post.likes,
        "rank": rank,
        "updatedAt": datetime.now(timezone.utc),
    }
    if image_bytes and image_meta:
        doc["image"] = {
            "data": Binary(image_bytes),
            "contentType": "image/webp",
            "width": image_meta["width"],
            "height": image_meta["height"],
            "bytes": len(image_bytes),
        }
        doc["imageHash"] = image_meta["hash"]
    return doc


def content_hash(docs: List[dict]) -> str:
    """
    Stable fingerprint of everything the website actually renders. Image bytes
    contribute via their hash, not their contents, and volatile fields such as
    updatedAt and like counts are excluded - otherwise every nightly run would
    look like a change and rewrite the collection for nothing.
    """
    h = hashlib.sha256()
    for d in docs:
        h.update(
            "|".join(
                [
                    str(d.get("_id")),
                    str(d.get("caption")),
                    str(d.get("timestamp")),
                    str(d.get("permalink")),
                    str(d.get("eventTitle")),
                    str(d.get("eventDate")),
                    str(d.get("imageHash")),
                    str(d.get("rank")),
                ]
            ).encode("utf-8")
        )
        h.update(b"\x00")
    return h.hexdigest()


__all__ = ["Store", "build_document", "content_hash", "image_hash", "PyMongoError"]
