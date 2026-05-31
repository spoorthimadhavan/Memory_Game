from __future__ import annotations

from app.schemas.action import PlayerActionResponse
from app.workflows.game_graph import GameWorkflow


class WorkflowService:
  """Thin facade over LangGraph workflow for tracing and extension."""

  def __init__(self):
    self._workflow = GameWorkflow()

  def execute_turn(
    self, session_id: str, action_text: str, category: str | None = None
  ) -> PlayerActionResponse:
    return self._workflow.run(session_id, action_text, category)
