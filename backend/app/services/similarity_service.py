from __future__ import annotations

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from app.core.config import get_settings
from app.core.logging import get_logger
from app.schemas.action import SimilarityResult

logger = get_logger(__name__)


class SimilarityService:
  """TF-IDF cosine similarity for repetition detection."""

  def __init__(self, threshold: float | None = None):
    self.threshold = threshold or get_settings().similarity_threshold

  def check_repetition(
    self, current_action: str, previous_actions: list[str]
  ) -> SimilarityResult:
    if not previous_actions:
      return SimilarityResult(threshold=self.threshold)

    corpus = previous_actions + [current_action]
    vectorizer = TfidfVectorizer(stop_words="english", ngram_range=(1, 2))
    matrix = vectorizer.fit_transform(corpus)
    current_vec = matrix[-1]
    prev_matrix = matrix[:-1]

    if prev_matrix.shape[0] == 0:
      return SimilarityResult(threshold=self.threshold)

    similarities = cosine_similarity(current_vec, prev_matrix).flatten()
    max_idx = int(similarities.argmax())
    max_sim = float(similarities[max_idx])
    is_repeated = max_sim > self.threshold

    logger.info(
      "similarity_check max_sim=%.3f is_repeated=%s",
      max_sim,
      is_repeated,
    )

    return SimilarityResult(
      is_repeated=is_repeated,
      max_similarity=round(max_sim, 4),
      most_similar_action=previous_actions[max_idx] if is_repeated else None,
      threshold=self.threshold,
    )
