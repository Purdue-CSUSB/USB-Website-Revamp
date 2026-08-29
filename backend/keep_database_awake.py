#!/usr/bin/env python3
"""
Standalone entry point for the database keepalive: `npm run keepalive`.

Why this exists: MongoDB Atlas pauses a free cluster after a stretch with no
connection, and a paused cluster refuses ALL connections until a human clicks
Resume in the dashboard - it does not wake itself when traffic arrives. A
serverless deployment only touches Mongo when somebody visits, so over a quiet
summer the site can genuinely go that long without a single connection. Then
/api/instagram/posts starts failing while the static pages keep loading normally,
and the carousel silently falls back to the checked-in insta_posts.json.

It deliberately goes through the public HTTP endpoint rather than connecting with
the driver:
  - GET /api/instagram/posts already reads MongoDB, so serving it resets Atlas's
    idle timer.
  - No database credential has to be stored wherever this runs.
  - It exercises the whole path (Vercel function -> Atlas), so it doubles as an
    uptime check. A direct driver connection would prove only that Atlas itself
    is reachable, not that the deployed site can reach it.

Uses nothing outside the standard library, so the workflow needs no pip install.
"""
from __future__ import annotations

import json
import os
import re
import sys
import time
from pathlib import Path
from urllib.request import Request, urlopen


def _load_dotenv() -> None:
    """
    Read SITE_URL (and anything else) out of the repo-root .env for local runs.

    Parsed by hand rather than with python-dotenv so this script keeps needing
    nothing outside the standard library - that is what lets the workflow skip a
    pip install entirely. Real environment variables win, so the Action's
    vars.SITE_URL is never shadowed by a stale local file.
    """
    env_file = Path(__file__).resolve().parents[1] / ".env"
    if not env_file.is_file():
        return
    for line in env_file.read_text(encoding="utf-8").splitlines():
        match = re.match(r"\s*([A-Z0-9_]+)\s*=\s*(.*)", line)
        if not match:
            continue
        key, value = match.group(1), match.group(2).strip().strip("\"'")
        if value and key not in os.environ:
            os.environ[key] = value


_load_dotenv()

ENDPOINT = "/api/instagram/posts"
ATTEMPTS = 5
RETRY_DELAY_S = 10
TIMEOUT_S = 30

# GitHub renders ::error:: annotations on the run summary; locally it is noise.
IN_GITHUB_ACTIONS = os.getenv("GITHUB_ACTIONS") == "true"


def report_failure(message: str) -> None:
    if IN_GITHUB_ACTIONS:
        print(f"::error title=Keepalive failed::{message}", file=sys.stderr)
    else:
        print(f"Keepalive failed: {message}", file=sys.stderr)


def ping_once(url: str) -> dict:
    """
    One attempt. A 200 alone is not proof the database answered, so this also
    requires the JSON shape the handler returns: if Mongo were unreachable the
    endpoint would 503, and a misrouted request (falling through to the SPA's
    index.html) would return HTML with a 200.
    """
    request = Request(url, headers={"User-Agent": "purdue-usb-keepalive"})
    with urlopen(request, timeout=TIMEOUT_S) as response:
        body = response.read().decode("utf-8", "replace")
        if response.status != 200:
            raise RuntimeError(f"HTTP {response.status} - {body[:300]}")

    try:
        data = json.loads(body)
    except json.JSONDecodeError:
        raise RuntimeError(
            "responded 200 but the body was not JSON, so MongoDB was probably not "
            "reached. Check SITE_URL points at the deployed site. "
            f"Body starts: {body[:200]}"
        ) from None

    if not isinstance(data, dict) or not isinstance(data.get("posts"), list):
        raise RuntimeError(f"responded with JSON but not the expected shape: {body[:200]}")

    return data


def run_keep_alive() -> str:
    base_url = os.getenv("SITE_URL", "").strip().rstrip("/")
    if not base_url:
        raise RuntimeError(
            "SITE_URL is not set. Add it as a repository variable, e.g. "
            "SITE_URL = https://purdueusb.com"
        )

    # "purdueusb.com" is the obvious way to write a domain, and is how the
    # repository variable was actually set - but urlopen rejects a schemeless URL
    # outright with "unknown url type", which failed this job silently every night.
    # Assume https rather than making the whole keepalive hinge on the spelling.
    if "://" not in base_url:
        base_url = f"https://{base_url}"

    url = f"{base_url}{ENDPOINT}"
    print(f"GET {url}")

    last_error: Exception | None = None
    for attempt in range(1, ATTEMPTS + 1):
        try:
            data = ping_once(url)
            count = len(data["posts"])
            synced = data.get("syncedAt") or "never"
            return f"OK - endpoint returned {count} post(s); MongoDB was reached. Last sync: {synced}"
        except Exception as error:  # noqa: BLE001 - any failure is worth retrying
            last_error = error
            print(f"  attempt {attempt}/{ATTEMPTS} failed: {error}")
            # Retries absorb a cold start or a brief blip rather than failing the run.
            if attempt < ATTEMPTS:
                time.sleep(RETRY_DELAY_S)

    raise last_error  # type: ignore[misc]


def main() -> int:
    try:
        print(run_keep_alive())
        return 0
    except Exception as error:  # noqa: BLE001
        report_failure(
            f"{error} - MongoDB was NOT touched. If this keeps failing, Atlas will "
            "pause the cluster and every API route will start returning 503."
        )
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
