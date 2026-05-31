import pytest

from app.core.exceptions import SessionNotFoundError
from app.repositories.memory_repository import MemoryRepository

pytestmark = pytest.mark.unit


def test_create_and_get_session(tmp_path):
  repo = MemoryRepository(db_path=tmp_path / "test.db")
  state = repo.create("Alice")
  loaded = repo.get(state.session_id)
  assert loaded.player_name == "Alice"
  assert loaded.level == 1


def test_missing_session_raises(tmp_path):
  repo = MemoryRepository(db_path=tmp_path / "test.db")
  with pytest.raises(SessionNotFoundError):
    repo.get("00000000-0000-0000-0000-000000000000")


def test_save_updates_existing_row(tmp_path):
  repo = MemoryRepository(db_path=tmp_path / "test.db")
  state = repo.create("Bob")
  state.level = 3
  state.total_score = 120
  repo.save(state)
  loaded = repo.get(state.session_id)
  assert loaded.level == 3
  assert loaded.total_score == 120
