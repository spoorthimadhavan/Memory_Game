from __future__ import annotations

from pydantic import BaseModel, Field


class MemorySessionState(BaseModel):
  session_id: str
  player_name: str = "Player"
  category_id: str = "nature"
  level: int = 1
  total_score: int = 0
  current_targets: list[str] = Field(default_factory=list)
  round_active: bool = False
