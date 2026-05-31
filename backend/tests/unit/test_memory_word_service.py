import pytest

from app.core.exceptions import InvalidCategoryError
from app.services.memory_word_service import MemoryWordService

pytestmark = pytest.mark.unit


@pytest.fixture
def words():
  return MemoryWordService()


def test_list_categories_has_twenty_five(words):
  cats = words.list_categories()
  assert len(cats) == 25
  assert all("id" in c and "label" in c and "word_count" in c for c in cats)


def test_build_round_sizes(words):
  targets, choices = words.build_round("food", word_count=5, choice_count=10)
  assert len(targets) == 5
  assert len(choices) == 10


def test_targets_subset_of_choices(words):
  targets, choices = words.build_round("science", word_count=4, choice_count=8)
  for t in targets:
    assert t in choices


def test_no_duplicate_targets(words):
  targets, _ = words.build_round("movies", word_count=8, choice_count=16)
  assert len(targets) == len(set(targets))


def test_distractors_same_topic(words):
  targets, choices = words.build_round("harry_potter", word_count=5, choice_count=10)
  pool = set(words._categories["harry_potter"]["words"])
  for word in choices:
    assert word in pool


def test_unknown_category_raises(words):
  with pytest.raises(InvalidCategoryError):
    words.resolve_category("not-a-real-topic")
