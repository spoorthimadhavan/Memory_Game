from __future__ import annotations

import uuid
from datetime import UTC, datetime
from pathlib import Path

import pandas as pd

from app.core.exceptions import SessionNotFoundError
from app.schemas.quest import AnswerHistoryItem, QuestState
from app.schemas.question import Question
from app.services.question_service import QuestionService

DATA_DIR = Path(__file__).resolve().parents[2] / "data"
SESSIONS_DIR = DATA_DIR / "sessions"
HISTORY_CSV = DATA_DIR / "quest_history.csv"


class QuestRepository:
  def __init__(self):
    SESSIONS_DIR.mkdir(parents=True, exist_ok=True)
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    if not HISTORY_CSV.exists():
      pd.DataFrame(
        columns=[
          "session_id",
          "history_id",
          "question_id",
          "topic",
          "question_text",
          "answer_text",
          "score",
          "quality",
          "level",
          "timestamp",
        ]
      ).to_csv(HISTORY_CSV, index=False)
    self.questions = QuestionService()

  def _session_path(self, session_id: str) -> Path:
    return SESSIONS_DIR / f"{session_id}.json"

  def create_quest(self, topic: str, player_name: str) -> QuestState:
    session_id = str(uuid.uuid4())
    question = self.questions.generate(topic, level=1, difficulty=1.0)
    state = QuestState(
      session_id=session_id,
      topic=topic,
      player_name=player_name,
      current_question=question,
    )
    self.save_state(state)
    return state

  def save_state(self, state: QuestState) -> None:
    self._session_path(state.session_id).write_text(
      state.model_dump_json(indent=2), encoding="utf-8"
    )

  def get_state(self, session_id: str) -> QuestState:
    path = self._session_path(session_id)
    if not path.exists():
      raise SessionNotFoundError(session_id)
    return QuestState.model_validate_json(path.read_text(encoding="utf-8"))

  def get_history(self, session_id: str) -> list[AnswerHistoryItem]:
    if not HISTORY_CSV.exists():
      return []
    df = pd.read_csv(HISTORY_CSV)
    if df.empty:
      return []
    subset = df[df["session_id"] == session_id]
    items = []
    for _, row in subset.iterrows():
      items.append(
        AnswerHistoryItem(
          id=str(row["history_id"]),
          question_id=str(row["question_id"]),
          topic=str(row["topic"]),
          question_text=str(row["question_text"]),
          answer_text=str(row["answer_text"]),
          score=int(row["score"]),
          quality=str(row["quality"]),
          level=int(row["level"]),
          timestamp=str(row["timestamp"]),
        )
      )
    return items

  def get_weak_answers(self, session_id: str) -> list[str]:
    return [
      h.answer_text
      for h in self.get_history(session_id)
      if h.quality in ("weak", "partial")
    ]

  def append_history(self, item: AnswerHistoryItem, session_id: str) -> None:
    row = {
      "session_id": session_id,
      "history_id": item.id,
      "question_id": item.question_id,
      "topic": item.topic,
      "question_text": item.question_text,
      "answer_text": item.answer_text,
      "score": item.score,
      "quality": item.quality,
      "level": item.level,
      "timestamp": item.timestamp,
    }
    df = pd.read_csv(HISTORY_CSV)
    df = pd.concat([df, pd.DataFrame([row])], ignore_index=True)
    df.to_csv(HISTORY_CSV, index=False)

  def reset_quest(self, session_id: str) -> QuestState:
    old = self.get_state(session_id)
    question = self.questions.generate(old.topic, level=1, difficulty=1.0)
    state = QuestState(
      session_id=session_id,
      topic=old.topic,
      player_name=old.player_name,
      current_question=question,
    )
    self.save_state(state)
    return state

  @staticmethod
  def new_history_item(
    question: Question,
    answer_text: str,
    score: int,
    quality: str,
    level: int,
  ) -> AnswerHistoryItem:
    return AnswerHistoryItem(
      id=str(uuid.uuid4()),
      question_id=question.id,
      topic=question.topic,
      question_text=question.text,
      answer_text=answer_text,
      score=score,
      quality=quality,
      level=level,
      timestamp=datetime.now(UTC).isoformat(),
    )
