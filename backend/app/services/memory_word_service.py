from __future__ import annotations

import json
import random
from pathlib import Path

from app.core.exceptions import InvalidCategoryError

DATA_PATH = Path(__file__).resolve().parents[2] / "data" / "word_categories.json"
DEFAULT_CATEGORY_ID = "nature"


class MemoryWordService:
  def __init__(self):
    with open(DATA_PATH, encoding="utf-8") as f:
      payload = json.load(f)
    self._categories: dict[str, dict] = {
      c["id"]: {"id": c["id"], "label": c["label"], "words": list(c["words"])}
      for c in payload["categories"]
    }
    self._default_category_id = (
      DEFAULT_CATEGORY_ID
      if DEFAULT_CATEGORY_ID in self._categories
      else next(iter(self._categories))
    )

  def list_categories(self) -> list[dict]:
    return [
      {"id": c["id"], "label": c["label"], "word_count": len(c["words"])}
      for c in sorted(self._categories.values(), key=lambda x: x["label"].lower())
    ]

  def resolve_category(self, category_id: str | None) -> str:
    cid = (category_id or self._default_category_id).strip().lower()
    if cid not in self._categories:
      raise InvalidCategoryError(cid)
    return cid

  def category_label(self, category_id: str) -> str:
    return self._categories[category_id]["label"]

  def build_round(
    self,
    category_id: str,
    word_count: int,
    choice_count: int,
  ) -> tuple[list[str], list[str]]:
    pool = list(self._categories[category_id]["words"])
    if len(pool) < choice_count:
      raise ValueError(
        f"Category {category_id!r} has only {len(pool)} words; need {choice_count} for this level.",
      )

    targets = random.sample(pool, min(word_count, len(pool)))
    remaining = [w for w in pool if w not in targets]
    distractor_n = choice_count - len(targets)
    distractors = random.sample(remaining, min(distractor_n, len(remaining)))
    choices = targets + distractors
    random.shuffle(choices)
    return targets, choices
