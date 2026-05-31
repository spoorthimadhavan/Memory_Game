from __future__ import annotations

from app.repositories.quest_repository import QuestRepository
from app.schemas.answer import AnswerRequest, AnswerResponse
from app.schemas.quest import QuestSessionResponse, QuestStartRequest, QuestStartResponse
from app.workflows.quest_graph import QuestWorkflow


class QuestService:
  def __init__(self):
    self.repo = QuestRepository()
    self.workflow = QuestWorkflow()

  def start_quest(self, request: QuestStartRequest) -> QuestStartResponse:
    state = self.repo.create_quest(request.topic.strip(), request.player_name or "Learner")
    return QuestStartResponse(
      session_id=state.session_id,
      quest_state=state,
      message=f"Mission started: {state.current_question.mission_title}. Good luck!",
    )

  def submit_answer(self, request: AnswerRequest) -> AnswerResponse:
    return self.workflow.run(
      request.session_id,
      request.question_id,
      request.answer_text,
    )

  def get_session(self, session_id: str) -> QuestSessionResponse:
    state = self.repo.get_state(session_id)
    history = self.repo.get_history(session_id)
    return QuestSessionResponse(quest_state=state, history=history)

  def reset_quest(self, session_id: str) -> QuestSessionResponse:
    state = self.repo.reset_quest(session_id)
    return QuestSessionResponse(quest_state=state, history=[])
