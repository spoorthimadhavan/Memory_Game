import pytest

from app.schemas.answer import EvaluationResult
from app.services.scoring_service import ScoringService

pytestmark = pytest.mark.unit


def test_scoring_strong_answer():
  service = ScoringService()
  evaluation = EvaluationResult(quality="strong", concept_similarity=0.8)
  score = service.calculate(evaluation, difficulty=1.2, streak=2)
  assert 0 < score.final_score <= 25


def test_scoring_repeated_mistake_penalty():
  service = ScoringService()
  evaluation = EvaluationResult(quality="weak", repeated_mistake=True, concept_similarity=0.1)
  score = service.calculate(evaluation, difficulty=1.0, streak=0)
  assert score.repetition_penalty < 0
