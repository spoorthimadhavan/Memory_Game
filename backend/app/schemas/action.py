from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field

from app.schemas.score import ScoreBreakdown


class SimilarityResult(BaseModel):
    is_repeated: bool = False
    max_similarity: float = 0.0
    most_similar_action: str | None = None
    threshold: float = 0.75


class AIFeedback(BaseModel):
    narrative: str
    tone: Literal["positive", "neutral", "warning"] = "neutral"
    highlights: list[str] = Field(default_factory=list)


class ActionHistoryItem(BaseModel):
    id: str
    action_text: str
    category: str | None = None
    score: int
    enemy_health_after: int
    is_repeated: bool = False
    timestamp: str


class PlayerActionRequest(BaseModel):
    session_id: str
    action_text: str = Field(min_length=3, max_length=500)
    category: str | None = None


class PlayerActionResponse(BaseModel):
    session_id: str
    feedback: AIFeedback
    score: ScoreBreakdown
    similarity: SimilarityResult
    enemy_health: int
    player_score: int
    strategy_warning: str | None = None
    history_item: ActionHistoryItem
    game_over: bool = False
    victory: bool = False
