from __future__ import annotations

from app.repositories.session_repository import SessionRepository
from app.schemas.action import PlayerActionRequest, PlayerActionResponse
from app.schemas.game import GameSessionResponse, GameStartRequest, GameStartResponse
from app.workflows.game_graph import GameWorkflow


class GameService:
  def __init__(self):
    self.repo = SessionRepository()
    self.workflow = GameWorkflow()

  def start_game(self, request: GameStartRequest) -> GameStartResponse:
    enemy = self.repo.get_enemy(request.enemy_id)
    state = self.repo.create_session(enemy, request.player_name or "Hero")
    return GameStartResponse(
      session_id=state.session_id,
      game_state=state,
      message=f"Fight {enemy.name}! Type what you do, then press Go.",
    )

  def process_action(self, request: PlayerActionRequest) -> PlayerActionResponse:
    return self.workflow.run(
      request.session_id,
      request.action_text,
      request.category,
    )

  def get_session(self, session_id: str) -> GameSessionResponse:
    state = self.repo.get_state(session_id)
    history = self.repo.get_history(session_id)
    return GameSessionResponse(game_state=state, action_history=history)

  def get_history(self, session_id: str):
    self.repo.get_state(session_id)  # validate exists
    return self.repo.get_history(session_id)

  def reset_game(self, session_id: str) -> GameSessionResponse:
    state = self.repo.reset_session(session_id)
    return GameSessionResponse(game_state=state, action_history=[])
