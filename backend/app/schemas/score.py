from __future__ import annotations

from pydantic import BaseModel, Field


class ScoreBreakdown(BaseModel):
    base: int = 10
    creativity_bonus: int = Field(ge=0, le=10, default=0)
    risk_bonus: int = Field(ge=0, le=5, default=0)
    repetition_penalty: int = Field(ge=-8, le=0, default=0)
    difficulty_multiplier: float = Field(ge=1.0, le=1.5, default=1.0)
    final_score: int = Field(ge=0, le=25, default=0)
