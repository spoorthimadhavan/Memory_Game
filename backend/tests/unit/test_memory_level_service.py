import pytest

from app.services.memory_level_service import MemoryLevelService

pytestmark = pytest.mark.unit


@pytest.fixture
def levels():
  return MemoryLevelService()


def test_level_one_has_five_words(levels):
  cfg = levels.config_for_level(1)
  assert cfg.word_count == 5
  assert cfg.choice_count == 10


def test_word_count_increases_by_one_per_level(levels):
  assert levels.config_for_level(1).word_count == 5
  assert levels.config_for_level(2).word_count == 6
  assert levels.config_for_level(3).word_count == 7


def test_memorize_time_decreases_with_level(levels):
  t1 = levels.config_for_level(1).memorize_seconds
  t5 = levels.config_for_level(5).memorize_seconds
  assert t5 < t1


def test_pass_threshold_increases(levels):
  assert levels.pass_threshold(1) < levels.pass_threshold(10)


def test_score_round_perfect_hit(levels):
  score = levels.score_round(level=1, hits=10, total_target=10, time_remaining_ms=5000, guess_seconds=18)
  assert score > 0
  assert score <= 150


def test_score_round_zero_targets(levels):
  assert levels.score_round(1, 0, 0, 0, 10) == 0
