from __future__ import annotations

import csv
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parents[2] / "data"
CONTACT_CSV = DATA_DIR / "contact_messages.csv"
SUGGESTION_CSV = DATA_DIR / "suggestions.csv"

__all__ = ["CONTACT_CSV", "DATA_DIR", "SUGGESTION_CSV", "list_contact_messages", "list_suggestions"]


def _read_csv(path: Path) -> list[dict[str, str]]:
  if not path.exists():
    return []
  with open(path, encoding="utf-8", newline="") as f:
    reader = csv.DictReader(f)
    return [dict(row) for row in reader]


def list_contact_messages() -> list[dict[str, str]]:
  rows = _read_csv(CONTACT_CSV)
  return list(reversed(rows))


def list_suggestions() -> list[dict[str, str]]:
  rows = _read_csv(SUGGESTION_CSV)
  return list(reversed(rows))
