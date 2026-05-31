from __future__ import annotations

import sqlite3
import uuid
from pathlib import Path
from urllib.parse import unquote

from app.core.config import get_settings
from app.core.exceptions import SessionNotFoundError
from app.schemas.memory_session import MemorySessionState


def sqlite_db_path(database_url: str) -> Path:
  """Resolve sqlite:///./data/game.db to a path under the backend folder."""
  prefix = "sqlite:///"
  if not database_url.startswith(prefix):
    raise ValueError(f"Only sqlite URLs are supported, got: {database_url}")
  raw = unquote(database_url[len(prefix) :])
  path = Path(raw)
  if not path.is_absolute():
    path = Path(__file__).resolve().parents[2] / path
  return path


class MemoryRepository:
  def __init__(self, db_path: Path | None = None) -> None:
    self.db_path = db_path or sqlite_db_path(get_settings().database_url)
    self.db_path.parent.mkdir(parents=True, exist_ok=True)
    self._init_schema()

  def _connect(self) -> sqlite3.Connection:
    return sqlite3.connect(self.db_path)

  def _init_schema(self) -> None:
    with self._connect() as conn:
      conn.execute(
        """
        CREATE TABLE IF NOT EXISTS memory_sessions (
          session_id TEXT PRIMARY KEY,
          state_json TEXT NOT NULL
        )
        """
      )

  def create(self, player_name: str, category_id: str = "nature") -> MemorySessionState:
    state = MemorySessionState(
      session_id=str(uuid.uuid4()),
      player_name=player_name,
      category_id=category_id,
    )
    self.save(state)
    return state

  def save(self, state: MemorySessionState) -> None:
    payload = state.model_dump_json()
    with self._connect() as conn:
      conn.execute(
        """
        INSERT INTO memory_sessions (session_id, state_json)
        VALUES (?, ?)
        ON CONFLICT(session_id) DO UPDATE SET state_json = excluded.state_json
        """,
        (state.session_id, payload),
      )

  def get(self, session_id: str) -> MemorySessionState:
    with self._connect() as conn:
      row = conn.execute(
        "SELECT state_json FROM memory_sessions WHERE session_id = ?",
        (session_id,),
      ).fetchone()
    if row is None:
      raise SessionNotFoundError(session_id)
    return MemorySessionState.model_validate_json(row[0])
