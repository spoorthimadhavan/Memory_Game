from __future__ import annotations

from pydantic import BaseModel, Field


class Question(BaseModel):
  id: str
  text: str
  topic: str
  level: int = Field(ge=1, default=1)
  difficulty: float = Field(ge=1.0, le=2.0, default=1.0)
  expected_concepts: list[str] = Field(default_factory=list)
  hint: str | None = None
  mission_title: str = "Mission"
