from __future__ import annotations

import json
import uuid
from pathlib import Path

from app.core.config import get_settings
from app.core.logging import get_logger
from app.schemas.question import Question

logger = get_logger(__name__)
DATA_DIR = Path(__file__).resolve().parents[2] / "data"
BANK_PATH = DATA_DIR / "question_bank.json"


class QuestionService:
  """Generates mission questions from bank (MVP) or LLM (when configured)."""

  def __init__(self):
    self.settings = get_settings()
    with open(BANK_PATH, encoding="utf-8") as f:
      self._bank: dict[str, list[dict]] = json.load(f)

  def normalize_topic(self, topic: str) -> str:
    key = topic.strip().lower()
    aliases = {
      "ai & llms": "ai",
      "llm": "ai",
      "devops": "cloud",
      "german vocabulary": "german",
      "deutsch": "german",
    }
    return aliases.get(key, key.replace(" ", "_")[:40])

  def generate(
    self,
    topic: str,
    level: int,
    difficulty: float,
    used_indices: list[int] | None = None,
  ) -> Question:
    key = self.normalize_topic(topic)
    pool = self._bank.get(key)

    if not pool:
      return self._custom_topic_question(topic, level, difficulty)

    used = used_indices or []
    available = [i for i in range(len(pool)) if i not in used]
    idx = available[0] if available else (level - 1) % len(pool)
    item = pool[idx]

    return Question(
      id=str(uuid.uuid4()),
      text=item["text"],
      topic=topic,
      level=level,
      difficulty=round(difficulty, 2),
      expected_concepts=item["expected_concepts"],
      hint=item.get("hint"),
      mission_title=item.get("mission_title", f"Level {level} Mission"),
    )

  def _custom_topic_question(self, topic: str, level: int, difficulty: float) -> Question:
    return Question(
      id=str(uuid.uuid4()),
      text=f"Explain one important idea about {topic} that a junior developer should know.",
      topic=topic,
      level=level,
      difficulty=round(difficulty, 2),
      expected_concepts=[topic.lower(), "explain", "example", "use case"],
      hint="Give a clear definition plus a short example.",
      mission_title=f"{topic.title()} — Level {level}",
    )
