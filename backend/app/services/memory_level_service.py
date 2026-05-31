from __future__ import annotations

from app.schemas.memory import LevelConfig


class MemoryLevelService:
  """Level scaling: more words, less memorize time, more distractors."""

  def config_for_level(self, level: int) -> LevelConfig:
    lvl = max(1, level)
    # Start at 5 words, +1 per level (gentle ramp)
    word_count = min(20, 4 + lvl)  # L1=5, L2=6, L3=7 … cap at 20
    memorize_seconds = round(max(4.0, 10.5 - lvl * 0.35), 1)
    choice_count = word_count * 2
    return LevelConfig(
      level=lvl,
      word_count=word_count,
      memorize_seconds=memorize_seconds,
      choice_count=choice_count,
    )

  def guess_seconds(self, level: int) -> float:
    """Time to pick words after memorize phase."""
    cfg = self.config_for_level(level)
    return round(max(8.0, cfg.word_count * 1.8 - level * 0.3), 1)

  def pass_threshold(self, level: int) -> float:
    """Minimum accuracy to advance (gets stricter)."""
    return min(0.9, 0.55 + level * 0.02)

  def score_round(
    self,
    level: int,
    hits: int,
    total_target: int,
    time_remaining_ms: int,
    guess_seconds: float,
  ) -> int:
    if total_target == 0:
      return 0
    base = int((hits / total_target) * 100)
    time_bonus = int((time_remaining_ms / max(guess_seconds * 1000, 1)) * 25)
    level_mult = 1.0 + (level - 1) * 0.15
    return int(min(150, (base + time_bonus) * level_mult))
