from fastapi import APIRouter, Depends

from app.schemas.action import ActionHistoryItem, PlayerActionRequest, PlayerActionResponse
from app.schemas.game import GameSessionResponse, GameStartRequest, GameStartResponse
from app.services.game_service import GameService

router = APIRouter(prefix="/game", tags=["game"])


def get_game_service() -> GameService:
  return GameService()


@router.post("/start", response_model=GameStartResponse)
def start_game(
  request: GameStartRequest,
  service: GameService = Depends(get_game_service),
):
  return service.start_game(request)


@router.post("/action", response_model=PlayerActionResponse)
def player_action(
  request: PlayerActionRequest,
  service: GameService = Depends(get_game_service),
):
  return service.process_action(request)


@router.get("/{session_id}", response_model=GameSessionResponse)
def get_game(session_id: str, service: GameService = Depends(get_game_service)):
  return service.get_session(session_id)


@router.get("/{session_id}/history", response_model=list[ActionHistoryItem])
def get_history(session_id: str, service: GameService = Depends(get_game_service)):
  return service.get_history(session_id)


@router.post("/{session_id}/reset", response_model=GameSessionResponse)
def reset_game(session_id: str, service: GameService = Depends(get_game_service)):
  return service.reset_game(session_id)
