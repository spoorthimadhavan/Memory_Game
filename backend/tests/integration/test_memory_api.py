import pytest

pytestmark = pytest.mark.integration


def test_health(client):
  res = client.get("/health")
  assert res.status_code == 200
  assert res.json()["status"] == "ok"


def test_level_config_endpoint(client):
  res = client.get("/memory/level/3/config")
  assert res.status_code == 200
  body = res.json()
  assert body["level_config"]["level"] == 3
  assert body["guess_seconds"] > 0


def test_list_categories(client):
  res = client.get("/memory/categories")
  assert res.status_code == 200
  cats = res.json()
  assert len(cats) == 25
  ids = {c["id"] for c in cats}
  assert "harry_potter" in ids
  assert "automobile" in ids


def test_start_and_round(client):
  start = client.post(
    "/memory/start",
    json={"player_name": "Integration", "category_id": "food"},
  )
  assert start.status_code == 200
  start_body = start.json()
  sid = start_body["session_id"]
  assert start_body["category_id"] == "food"
  assert start_body["category_label"] == "Food"

  rnd = client.post(f"/memory/{sid}/round")
  assert rnd.status_code == 200
  data = rnd.json()
  assert data["category_id"] == "food"
  assert len(data["memorize_words"]) == data["level_config"]["word_count"]
  assert len(data["choices"]) == data["level_config"]["choice_count"]
  assert data["memorize_seconds"] > 0
  assert data["guess_seconds"] > 0


def test_round_words_all_from_category(client):
  from app.services.memory_word_service import MemoryWordService

  pool = set(MemoryWordService()._categories["science"]["words"])
  start = client.post("/memory/start", json={"category_id": "science"})
  sid = start.json()["session_id"]
  rnd = client.post(f"/memory/{sid}/round").json()
  for word in rnd["choices"]:
    assert word in pool


def test_perfect_guess_levels_up(client, memory_session):
  sid = memory_session["session_id"]
  rnd = client.post(f"/memory/{sid}/round").json()

  guess = client.post(
    "/memory/guess",
    json={
      "session_id": sid,
      "selected_words": rnd["memorize_words"],
      "time_remaining_ms": 5000,
    },
  )
  assert guess.status_code == 200
  body = guess.json()
  assert body["passed"] is True
  assert body["accuracy"] == 1.0
  assert body["level_up"] is True
  assert body["level"] == 2
  assert body["next_round"] is not None


def test_partial_guess_may_fail(client, memory_session):
  sid = memory_session["session_id"]
  rnd = client.post(f"/memory/{sid}/round").json()
  only_one = [rnd["memorize_words"][0]] if rnd["memorize_words"] else []

  guess = client.post(
    "/memory/guess",
    json={
      "session_id": sid,
      "selected_words": only_one,
      "time_remaining_ms": 100,
    },
  )
  assert guess.status_code == 200
  body = guess.json()
  if len(rnd["memorize_words"]) > 1:
    assert body["accuracy"] < 1.0


def test_guess_invalid_session(client):
  res = client.post(
    "/memory/guess",
    json={
      "session_id": "00000000-0000-0000-0000-000000000000",
      "selected_words": ["test"],
      "time_remaining_ms": 0,
    },
  )
  assert res.status_code == 404


def test_round_invalid_session(client):
  res = client.post("/memory/00000000-0000-0000-0000-000000000000/round")
  assert res.status_code == 404


def test_guess_without_active_round(client, memory_session):
  sid = memory_session["session_id"]
  res = client.post(
    "/memory/guess",
    json={"session_id": sid, "selected_words": ["a"], "time_remaining_ms": 0},
  )
  assert res.status_code == 400
