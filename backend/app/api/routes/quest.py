from fastapi import APIRouter, Depends

from app.schemas.answer import AnswerRequest, AnswerResponse
from app.schemas.quest import (
  AnswerHistoryItem,
  QuestSessionResponse,
  QuestStartRequest,
  QuestStartResponse,
)
from app.services.quest_service import QuestService

router = APIRouter(prefix="/quest", tags=["quest"])


def get_quest_service() -> QuestService:
  return QuestService()


@router.post("/start", response_model=QuestStartResponse)
def start_quest(
  request: QuestStartRequest,
  service: QuestService = Depends(get_quest_service),
):
  return service.start_quest(request)


@router.post("/answer", response_model=AnswerResponse)
def submit_answer(
  request: AnswerRequest,
  service: QuestService = Depends(get_quest_service),
):
  return service.submit_answer(request)


@router.get("/{session_id}", response_model=QuestSessionResponse)
def get_quest(session_id: str, service: QuestService = Depends(get_quest_service)):
  return service.get_session(session_id)


@router.get("/{session_id}/history", response_model=list[AnswerHistoryItem])
def get_history(session_id: str, service: QuestService = Depends(get_quest_service)):
  return service.get_session(session_id).history


@router.post("/{session_id}/reset", response_model=QuestSessionResponse)
def reset_quest(session_id: str, service: QuestService = Depends(get_quest_service)):
  return service.reset_quest(session_id)
