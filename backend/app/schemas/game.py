from __future__ import annotations

from pydantic import BaseModel, Field

from app.schemas.action import ActionHistoryItem
from app.schemas.enemy import Enemy


class GameStartRequest(BaseModel):
    enemy_id: str | None = None
    player_name: str | None = "Hero"


class GameState(BaseModel):
    session_id: str
    enemy: Enemy
    player_score: int = 0
    turn_count: int = 0
    game_over: bool = False
    victory: bool = False


class GameStartResponse(BaseModel):
    session_id: str
    game_state: GameState
    message: str = "Battle begins! Describe your move."


class GameSessionResponse(BaseModel):
    game_state: GameState
    action_history: list[ActionHistoryItem] = Field(default_factory=list)
