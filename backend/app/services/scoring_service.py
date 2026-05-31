from __future__ import annotations

import numpy as np

from app.schemas.answer import EvaluationResult
from app.schemas.score import ScoreBreakdown


class ScoringService:
  """NumPy scoring for quiz answers with streak and difficulty."""

  def calculate(
    self,
    evaluation: EvaluationResult,
    difficulty: float,
    streak: int,
  ) -> ScoreBreakdown:
    quality_bonus = {"strong": 10, "partial": 5, "weak": 1}[evaluation.quality]
    concept_bonus = int(np.clip(evaluation.concept_similarity * 8, 0, 8))
    streak_bonus = int(np.clip(streak * 1.5, 0, 5))

    repetition_penalty = -4 if evaluation.repeated_mistake else 0
    base = 8
    multiplier = float(np.clip(difficulty, 1.0, 2.0))
    raw = (base + quality_bonus + concept_bonus + streak_bonus + repetition_penalty) * multiplier
    final_score = int(np.clip(np.round(raw), 0, 25))

    return ScoreBreakdown(
      base=base,
      creativity_bonus=quality_bonus,
      risk_bonus=streak_bonus,
      repetition_penalty=repetition_penalty,
      difficulty_multiplier=round(multiplier, 2),
      final_score=final_score,
    )
