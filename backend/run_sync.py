#!/usr/bin/env python3
"""
Entry point for the nightly Instagram sync.

    python backend/run_sync.py              # scrape, classify, write if changed
    python backend/run_sync.py --dry-run    # everything except the write

Secrets come from the environment (or a .env file at the repo root); everything
else is a constant in usb_sync/config.py.
"""
from __future__ import annotations

import argparse
import logging
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from usb_sync.config import Config, ConfigError  # noqa: E402
from usb_sync.sync import run  # noqa: E402


def main() -> int:
    parser = argparse.ArgumentParser(description="Sync recent Instagram events into MongoDB.")
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="run the whole pipeline but do not write to MongoDB",
    )
    parser.add_argument(
        "--allow-heuristic",
        action="store_true",
        help=(
            "write even if the vision model classified little or nothing. The "
            "caption-only fallback picks posts but cannot read flyers, so the "
            "results carry no event titles or dates."
        ),
    )
    args = parser.parse_args()

    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s %(levelname)-7s %(name)s: %(message)s",
        datefmt="%H:%M:%S",
    )
    try:
        config = Config.from_env(dry_run=args.dry_run, allow_heuristic=args.allow_heuristic)
    except ConfigError as exc:
        logging.error("%s", exc)
        logging.error("Copy .env.example to .env and fill in the values.")
        return 2

    try:
        return run(config)
    except Exception:
        logging.exception("Sync failed")
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
