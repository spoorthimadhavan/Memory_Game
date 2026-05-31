import os

import pytest
from fastapi.testclient import TestClient

os.environ["USE_MOCK_LLM"] = "true"
os.environ["ENVIRONMENT"] = "test"

from app.main import app  # noqa: E402


@pytest.fixture
def client():
  return TestClient(app)


@pytest.fixture(autouse=True)
def isolated_memory_db(tmp_path, monkeypatch):
  """Keep memory game tests from writing to the dev SQLite file."""
  db = tmp_path / "test.db"
  monkeypatch.setenv("DATABASE_URL", f"sqlite:///{db}")
  from app.core.config import get_settings

  get_settings.cache_clear()
  yield
  get_settings.cache_clear()


@pytest.fixture
def memory_session(client):
  res = client.post("/memory/start", json={"player_name": "Tester"})
  assert res.status_code == 200
  data = res.json()
  return {
    "session_id": data["session_id"],
    "level": data["level"],
  }
