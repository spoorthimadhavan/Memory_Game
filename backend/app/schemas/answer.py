from __future__ import annotations

from pydantic import BaseModel, Field

from app.schemas.quest import AnswerHistoryItem
from app.schemas.question import Question
from app.schemas.score import ScoreBreakdown


class EvaluationResult(BaseModel):
  concept_similarity: float = 0.0
  quality: str = "weak"  # strong | partial | weak
  matched_concepts: list[str] = Field(default_factory=list)
  repeated_mistake: bool = False
  threshold: float = 0.45


class AIFeedback(BaseModel):
  narrative: str
  tone: str = "neutral"  # positive | neutral | warning
  highlights: list[str] = Field(default_factory=list)


class AnswerRequest(BaseModel):
  session_id: str
  question_id: str
  answer_text: str = Field(min_length=2, max_length=2000)


class AnswerResponse(BaseModel):
  session_id: str
  evaluation: EvaluationResult
  score: ScoreBreakdown
  explanation: AIFeedback
  level_up: bool = False
  new_level: int = 1
  xp: int = 0
  streak: int = 0
  next_question: Question
  weak_topic_warning: str | None = None
  history_item: AnswerHistoryItem
