from __future__ import annotations

from pydantic import BaseModel, Field


class Enemy(BaseModel):
    id: str
    name: str
    max_health: int = Field(ge=1)
    difficulty: float = Field(ge=1.0, le=1.5, default=1.0)
    description: str = ""
    weaknesses: list[str] = Field(default_factory=list)
    current_health: int | None = None

    @property
    def health(self) -> int:
        return self.current_health if self.current_health is not None else self.max_health
