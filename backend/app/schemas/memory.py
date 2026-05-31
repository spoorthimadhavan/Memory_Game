from __future__ import annotations

from pydantic import BaseModel, Field


class LevelConfig(BaseModel):
  level: int
  word_count: int
  memorize_seconds: float
  choice_count: int


class WordCategoryInfo(BaseModel):
  id: str
  label: str
  word_count: int


class MemoryStartRequest(BaseModel):
  player_name: str | None = "Player"
  category_id: str = "nature"


class MemoryStartResponse(BaseModel):
  session_id: str
  level: int
  total_score: int = 0
  category_id: str
  category_label: str
  message: str


class MemoryRoundResponse(BaseModel):
  session_id: str
  level: int
  category_id: str
  category_label: str
  level_config: LevelConfig
  memorize_words: list[str]
  memorize_seconds: float
  guess_seconds: float
  pass_threshold: float
  choices: list[str]


class MemoryGuessRequest(BaseModel):
  session_id: str
  selected_words: list[str] = Field(default_factory=list)
  time_remaining_ms: int = Field(ge=0, description="Ms left on guess timer when submitted")


class MemoryGuessResponse(BaseModel):
  session_id: str
  level: int
  correct_words: list[str]
  selected_words: list[str]
  hits: list[str]
  misses: list[str]
  false_picks: list[str]
  score_earned: int
  total_score: int
  accuracy: float
  passed: bool
  level_up: bool
  next_level: int
  message: str
  next_round: MemoryRoundResponse | None = None
