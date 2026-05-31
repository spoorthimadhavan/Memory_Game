import pytest

from app.schemas.memory import MemoryGuessRequest, MemoryStartRequest
from app.services.memory_service import MemoryService

pytestmark = pytest.mark.unit


@pytest.fixture
def service():
  return MemoryService()


def test_start_returns_session(service):
  res = service.start(MemoryStartRequest(player_name="Unit"))
  assert res.session_id
  assert res.level == 1


def test_round_has_correct_word_count(service):
  start = service.start(MemoryStartRequest())
  rnd = service.start_round(start.session_id)
  assert len(rnd.memorize_words) == rnd.level_config.word_count
  assert len(rnd.choices) == rnd.level_config.choice_count


def test_perfect_guess_passes(service):
  start = service.start(MemoryStartRequest())
  rnd = service.start_round(start.session_id)
  res = service.submit_guess(
    MemoryGuessRequest(
      session_id=start.session_id,
      selected_words=rnd.memorize_words,
      time_remaining_ms=4000,
    )
  )
  assert res.passed is True
  assert res.accuracy == 1.0
  assert res.level_up is True
  assert res.next_round is not None


def test_empty_guess_fails(service):
  start = service.start(MemoryStartRequest())
  service.start_round(start.session_id)
  res = service.submit_guess(
    MemoryGuessRequest(
      session_id=start.session_id,
      selected_words=[],
      time_remaining_ms=1000,
    )
  )
  assert res.passed is False
  assert res.accuracy == 0.0


def test_guess_without_round_raises(service):
  start = service.start(MemoryStartRequest())
  with pytest.raises(ValueError, match="No active round"):
    service.submit_guess(
      MemoryGuessRequest(
        session_id=start.session_id,
        selected_words=["a"],
        time_remaining_ms=0,
      )
    )
