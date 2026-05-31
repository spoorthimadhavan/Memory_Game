from __future__ import annotations

from pydantic import BaseModel, Field

from app.schemas.question import Question


class QuestStartRequest(BaseModel):
  topic: str = Field(min_length=2, max_length=80)
  player_name: str | None = "Learner"


class QuestState(BaseModel):
  session_id: str
  topic: str
  player_name: str = "Learner"
  level: int = 1
  xp: int = 0
  difficulty: float = Field(ge=1.0, le=2.0, default=1.0)
  streak: int = 0
  missions_completed: int = 0
  current_question: Question
  weak_concepts: list[str] = Field(default_factory=list)


class QuestStartResponse(BaseModel):
  session_id: str
  quest_state: QuestState
  message: str


class QuestSessionResponse(BaseModel):
  quest_state: QuestState
  history: list["AnswerHistoryItem"] = Field(default_factory=list)


class AnswerHistoryItem(BaseModel):
  id: str
  question_id: str
  topic: str
  question_text: str
  answer_text: str
  score: int
  quality: str
  level: int
  timestamp: str
