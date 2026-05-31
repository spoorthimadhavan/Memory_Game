from __future__ import annotations

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from app.core.config import get_settings
from app.schemas.answer import EvaluationResult


class EvaluationService:
  """TF-IDF evaluation of learner answers against expected concepts."""

  def __init__(self, threshold: float | None = None):
    settings = get_settings()
    self.concept_threshold = threshold or 0.45
    self.repeat_threshold = settings.similarity_threshold

  def evaluate(
    self,
    answer_text: str,
    expected_concepts: list[str],
    previous_weak_answers: list[str],
  ) -> EvaluationResult:
    answer = answer_text.strip()
    if not expected_concepts:
      return EvaluationResult(quality="partial", concept_similarity=0.5)

    matrix = TfidfVectorizer(stop_words="english").fit_transform(
      expected_concepts + [answer]
    )
    answer_vec = matrix[-1]
    concept_matrix = matrix[:-1]
    sims = cosine_similarity(answer_vec, concept_matrix).flatten()
    max_sim = float(sims.max()) if len(sims) else 0.0
    matched = [
      expected_concepts[i]
      for i, s in enumerate(sims)
      if float(s) >= self.concept_threshold * 0.8
    ]

    if max_sim >= 0.55:
      quality = "strong"
    elif max_sim >= self.concept_threshold:
      quality = "partial"
    else:
      quality = "weak"

    repeated = False
    if previous_weak_answers and quality != "strong":
      repeat = self._check_repeat(answer, previous_weak_answers)
      repeated = repeat

    return EvaluationResult(
      concept_similarity=round(max_sim, 4),
      quality=quality,
      matched_concepts=matched[:5],
      repeated_mistake=repeated,
      threshold=self.concept_threshold,
    )

  def _check_repeat(self, answer: str, previous: list[str]) -> bool:
    corpus = previous + [answer]
    matrix = TfidfVectorizer(stop_words="english").fit_transform(corpus)
    sims = cosine_similarity(matrix[-1], matrix[:-1]).flatten()
    return bool(len(sims) and float(sims.max()) > self.repeat_threshold)
