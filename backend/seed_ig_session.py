#!/usr/bin/env python3
"""
Mint an Instagram session on a trusted machine so the nightly job never logs in.

Instagram answers a username/password login from a datacenter IP with a
`challenge_required` checkpoint, and GitHub-hosted runners are all datacenter
IPs. No amount of retrying fixes that: the checkpoint is designed to require a
human on a device Instagram already trusts. So the login happens here, once,
from a residential connection, and the resulting session - cookies plus the
device fingerprint that produced them - is what CI replays.

    python backend/seed_ig_session.py            # log in, store the session
    python backend/seed_ig_session.py --check    # only test the stored session
    python backend/seed_ig_session.py --no-env   # skip the .env write

The session goes to MongoDB, which is where the sync job looks first, and to
IG_SESSION in .env, which is the value to mirror into the repository secret as a
bootstrap for when the database copy is missing or stale. .env is gitignored.

Any 2FA code or checkpoint prompt is answered interactively; set IG_TOTP_SECRET
to have the authenticator code generated for you.
"""
from __future__ import annotations

import argparse
import base64
import json
import logging
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from usb_sync import config as cfg  # noqa: E402
from usb_sync.config import Config, ConfigError  # noqa: E402
from usb_sync.instagram import _build_client, _cached_settings, _session_is_live  # noqa: E402
from usb_sync.store import Store  # noqa: E402

log = logging.getLogger("seed")


def _open_store(config: Config) -> Store:
    return Store(
        config.mongodb_uri,
        config.mongodb_db,
        cfg.POSTS_COLLECTION,
        cfg.META_COLLECTION,
        cfg.CLASSIFIED_COLLECTION,
    )


def _install_prompts(client, totp_secret: str) -> None:
    """Answer Instagram's interactive checks from the terminal."""

    def code_handler(username: str, choice) -> str:
        return input(f"Verification code sent to {username} via {choice}: ").strip()

    def password_handler(username: str) -> str:
        raise RuntimeError(
            f"Instagram is demanding a password change for @{username}. "
            "Do that in the official app, then re-run this script."
        )

    client.challenge_code_handler = code_handler
    client.change_password_handler = password_handler


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--check", action="store_true", help="test the stored session without logging in")
    parser.add_argument("--no-env", dest="write_env", action="store_false", help="do not touch .env")
    args = parser.parse_args()

    logging.basicConfig(level=logging.INFO, format="%(levelname)-7s %(name)s: %(message)s")

    try:
        config = Config.from_env()
    except ConfigError as exc:
        log.error("%s", exc)
        return 2
    if not config.ig_username:
        log.error("IG_USERNAME is required")
        return 2

    with _open_store(config) as store:
        client = _build_client(config.ig_proxy)

        candidates = _cached_settings(config.ig_username, store, config.ig_session)
        for settings, source in candidates:
            client.set_settings(settings)
            if _session_is_live(client):
                log.info("The stored session (%s) is still valid for @%s", source, config.ig_username)
                store.save_session(config.ig_username, json.dumps(client.get_settings()).encode("utf-8"))
                _emit(client, args.write_env)
                return 0
            log.warning("The %s session is dead", source)
        if not candidates and args.check:
            log.error("No stored session to check")
            return 1

        if args.check:
            return 1

        if not config.ig_password:
            log.error("IG_PASSWORD is required to mint a new session")
            return 2

        _install_prompts(client, config.ig_totp_secret)
        verification_code = ""
        if config.ig_totp_secret:
            verification_code = client.totp_generate_code(config.ig_totp_secret)

        try:
            client.login(
                config.ig_username,
                config.ig_password,
                relogin=bool(candidates),
                verification_code=verification_code,
            )
        except Exception as exc:
            log.error("Login failed: %s", exc)
            log.error(
                "If this is a checkpoint, open Instagram in the app on your phone, "
                "approve the login attempt, then run this script again."
            )
            return 1

        if not _session_is_live(client):
            log.error("Logged in but the session does not answer authenticated calls")
            return 1

        store.save_session(config.ig_username, json.dumps(client.get_settings()).encode("utf-8"))
        log.info("Stored a fresh session for @%s in MongoDB", config.ig_username)
        _emit(client, args.write_env)
        return 0


def _write_env(blob: str) -> bool:
    """Upsert IG_SESSION into the repo-root .env, leaving every other line alone."""
    env = Path(__file__).resolve().parents[1] / ".env"
    if not env.is_file():
        log.warning("No .env at %s; skipping the write", env)
        return False
    lines = env.read_text().splitlines()
    line = f"IG_SESSION={blob}"
    for i, existing in enumerate(lines):
        if existing.startswith("IG_SESSION="):
            lines[i] = line
            break
    else:
        lines.append("")
        lines.append("# Session minted by seed_ig_session.py. Mirror into the GitHub secret.")
        lines.append(line)
    env.write_text("\n".join(lines) + "\n")
    log.info("Wrote IG_SESSION to %s", env)
    return True


def _emit(client, write_env: bool) -> None:
    blob = base64.b64encode(json.dumps(client.get_settings()).encode("utf-8")).decode("ascii")
    if write_env:
        _write_env(blob)
    print("\n--- IG_SESSION (mirror this into the GitHub repository secret) ---")
    print(blob)
    print("--- end ---\n")
    print("  gh secret set IG_SESSION --body \"$(grep '^IG_SESSION=' .env | cut -d= -f2-)\"")


if __name__ == "__main__":
    raise SystemExit(main())
