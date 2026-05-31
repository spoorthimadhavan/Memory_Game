import pytest

pytestmark = pytest.mark.integration


def test_contact_form(client):
  res = client.post(
    "/feedback/contact",
    json={
      "name": "Spoorthi",
      "email": "test@example.com",
      "message": "Hello from integration test!",
    },
  )
  assert res.status_code == 200
  assert res.json()["ok"] is True


def test_suggestion_form(client):
  res = client.post(
    "/feedback/suggestion",
    json={
      "name": "Player",
      "suggestion": "Add a dark mode toggle to the memory game please.",
    },
  )
  assert res.status_code == 200
