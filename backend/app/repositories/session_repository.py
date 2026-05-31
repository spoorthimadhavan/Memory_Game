from __future__ import annotations

import json
import uuid
from datetime import UTC, datetime
from pathlib import Path

import pandas as pd

from app.core.exceptions import SessionNotFoundError
from app.schemas.action import ActionHistoryItem
from app.schemas.enemy import Enemy
from app.schemas.game import GameState

DATA_DIR = Path(__file__).resolve().parents[2] / "data"
SESSIONS_DIR = DATA_DIR / "sessions"
HISTORY_CSV = DATA_DIR / "action_history.csv"
ENEMIES_JSON = DATA_DIR / "enemies.json"


class SessionRepository:
  def __init__(self):
    SESSIONS_DIR.mkdir(parents=True, exist_ok=True)
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    if not HISTORY_CSV.exists():
      pd.DataFrame(
        columns=[
          "session_id",
          "action_id",
          "action_text",
          "category",
          "score",
          "enemy_health_after",
          "is_repeated",
          "timestamp",
        ]
      ).to_csv(HISTORY_CSV, index=False)

  def load_enemies(self) -> list[Enemy]:
    with open(ENEMIES_JSON, encoding="utf-8") as f:
      raw = json.load(f)
    return [Enemy(**e) for e in raw]

  def get_enemy(self, enemy_id: str | None = None) -> Enemy:
    enemies = self.load_enemies()
    if enemy_id:
      for e in enemies:
        if e.id == enemy_id:
          return e.model_copy(update={"current_health": e.max_health})
    return enemies[0].model_copy(update={"current_health": enemies[0].max_health})

  def _session_path(self, session_id: str) -> Path:
    return SESSIONS_DIR / f"{session_id}.json"

  def create_session(self, enemy: Enemy, player_name: str = "Hero") -> GameState:
    session_id = str(uuid.uuid4())
    state = GameState(
      session_id=session_id,
      enemy=enemy,
      player_score=0,
      turn_count=0,
    )
    self.save_state(state)
    return state

  def save_state(self, state: GameState) -> None:
    path = self._session_path(state.session_id)
    path.write_text(state.model_dump_json(indent=2), encoding="utf-8")

  def get_state(self, session_id: str) -> GameState:
    path = self._session_path(session_id)
    if not path.exists():
      raise SessionNotFoundError(session_id)
    return GameState.model_validate_json(path.read_text(encoding="utf-8"))

  def get_previous_actions(self, session_id: str) -> list[str]:
    return [h.action_text for h in self.get_history(session_id)]

  def get_history(self, session_id: str) -> list[ActionHistoryItem]:
    if not HISTORY_CSV.exists():
      return []
    df = pd.read_csv(HISTORY_CSV)
    if df.empty:
      return []
    subset = df[df["session_id"] == session_id]
    items = []
    for _, row in subset.iterrows():
      items.append(
        ActionHistoryItem(
          id=str(row["action_id"]),
          action_text=str(row["action_text"]),
          category=str(row["category"]) if pd.notna(row.get("category")) else None,
          score=int(row["score"]),
          enemy_health_after=int(row["enemy_health_after"]),
          is_repeated=bool(row["is_repeated"]),
          timestamp=str(row["timestamp"]),
        )
      )
    return items

  def append_history(self, item: ActionHistoryItem, session_id: str) -> None:
    row = {
      "session_id": session_id,
      "action_id": item.id,
      "action_text": item.action_text,
      "category": item.category or "",
      "score": item.score,
      "enemy_health_after": item.enemy_health_after,
      "is_repeated": item.is_repeated,
      "timestamp": item.timestamp,
    }
    df = pd.read_csv(HISTORY_CSV)
    df = pd.concat([df, pd.DataFrame([row])], ignore_index=True)
    df.to_csv(HISTORY_CSV, index=False)

  def reset_session(self, session_id: str) -> GameState:
    state = self.get_state(session_id)
    enemy = self.get_enemy(state.enemy.id)
    state.enemy = enemy
    state.player_score = 0
    state.turn_count = 0
    state.game_over = False
    state.victory = False
    self.save_state(state)
    return state

  @staticmethod
  def new_history_item(
    action_text: str,
    score: int,
    enemy_health_after: int,
    is_repeated: bool,
    category: str | None = None,
  ) -> ActionHistoryItem:
    return ActionHistoryItem(
      id=str(uuid.uuid4()),
      action_text=action_text,
      category=category,
      score=score,
      enemy_health_after=enemy_health_after,
      is_repeated=is_repeated,
      timestamp=datetime.now(UTC).isoformat(),
    )
