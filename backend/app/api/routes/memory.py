from fastapi import APIRouter, Depends, HTTPException

from app.core.exceptions import InvalidCategoryError, SessionNotFoundError
from app.schemas.memory import (
  MemoryGuessRequest,
  MemoryGuessResponse,
  MemoryRoundResponse,
  MemoryStartRequest,
  MemoryStartResponse,
  WordCategoryInfo,
)
from app.services.memory_service import MemoryService

router = APIRouter(prefix="/memory", tags=["memory"])


def get_memory_service() -> MemoryService:
  return MemoryService()


@router.get("/categories", response_model=list[WordCategoryInfo])
def list_categories(service: MemoryService = Depends(get_memory_service)):
  return service.list_categories()


@router.post("/start", response_model=MemoryStartResponse)
def start_game(request: MemoryStartRequest, service: MemoryService = Depends(get_memory_service)):
  try:
    return service.start(request)
  except InvalidCategoryError as exc:
    raise HTTPException(status_code=400, detail=exc.message) from exc


@router.post("/{session_id}/round", response_model=MemoryRoundResponse)
def start_round(session_id: str, service: MemoryService = Depends(get_memory_service)):
  try:
    return service.start_round(session_id)
  except SessionNotFoundError as exc:
    raise HTTPException(status_code=404, detail=exc.message) from exc


@router.post("/guess", response_model=MemoryGuessResponse)
def submit_guess(request: MemoryGuessRequest, service: MemoryService = Depends(get_memory_service)):
  try:
    return service.submit_guess(request)
  except SessionNotFoundError as exc:
    raise HTTPException(status_code=404, detail=exc.message) from exc
  except ValueError as exc:
    raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/level/{level}/config")
def get_level_config(level: int, service: MemoryService = Depends(get_memory_service)):
  return {
    "level_config": service.level_config(level),
    "guess_seconds": service.guess_seconds(level),
    "pass_threshold": service.levels.pass_threshold(level),  # noqa: SLF001
  }
