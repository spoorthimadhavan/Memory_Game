import pytest

from app.services.evaluation_service import EvaluationService

pytestmark = pytest.mark.unit


def test_strong_answer_matches_concepts():
  service = EvaluationService()
  result = service.evaluate(
    "A list comprehension builds a new list by iterating with a concise syntax, often with a filter.",
    ["list comprehension", "iterate", "concise", "filter", "transform"],
    [],
  )
  assert result.quality in ("strong", "partial")
  assert result.concept_similarity > 0.35


def test_weak_answer():
  service = EvaluationService()
  result = service.evaluate("idk", ["list comprehension", "iterate"], [])
  assert result.quality == "weak"
