"""End-to-end memory game: multiple levels in one session."""

import pytest

pytestmark = pytest.mark.integration


def test_two_level_progression(client):
  start = client.post("/memory/start", json={}).json()
  sid = start["session_id"]
  assert start["level"] == 1

  for expected_level in (2, 3):
    rnd = client.post(f"/memory/{sid}/round").json()
    guess = client.post(
      "/memory/guess",
      json={
        "session_id": sid,
        "selected_words": rnd["memorize_words"],
        "time_remaining_ms": 8000,
      },
    ).json()
    assert guess["passed"] is True, guess
    assert guess["level"] == expected_level
    assert guess["total_score"] > 0
