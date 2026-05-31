from __future__ import annotations

from typing import Any, TypedDict

from langgraph.graph import END, StateGraph

from app.core.exceptions import InvalidActionError
from app.repositories.session_repository import SessionRepository
from app.schemas.action import (
  AIFeedback,
  ActionHistoryItem,
  PlayerActionResponse,
  SimilarityResult,
)
from app.schemas.game import GameState
from app.schemas.score import ScoreBreakdown
from app.services.llm_service import LLMService
from app.services.scoring_service import ScoringService
from app.services.similarity_service import SimilarityService


class WorkflowState(TypedDict, total=False):
  session_id: str
  action_text: str
  category: str | None
  game_state: GameState
  previous_actions: list[str]
  similarity: SimilarityResult
  score: ScoreBreakdown
  feedback: AIFeedback
  history_item: ActionHistoryItem
  strategy_warning: str | None
  response: PlayerActionResponse


class GameWorkflow:
  def __init__(self):
    self.repo = SessionRepository()
    self.similarity = SimilarityService()
    self.scoring = ScoringService()
    self.llm = LLMService()
    self.graph = self._build_graph()

  def _build_graph(self):
    graph = StateGraph(WorkflowState)

    graph.add_node("validate_action", self.validate_action_node)
    graph.add_node("load_session", self.load_session_node)
    graph.add_node("similarity_check", self.similarity_check_node)
    graph.add_node("score_calculation", self.score_calculation_node)
    graph.add_node("llm_feedback", self.llm_feedback_node)
    graph.add_node("update_state", self.update_state_node)
    graph.add_node("response", self.response_node)

    graph.set_entry_point("validate_action")
    graph.add_edge("validate_action", "load_session")
    graph.add_edge("load_session", "similarity_check")
    graph.add_edge("similarity_check", "score_calculation")
    graph.add_edge("score_calculation", "llm_feedback")
    graph.add_edge("llm_feedback", "update_state")
    graph.add_edge("update_state", "response")
    graph.add_edge("response", END)

    return graph.compile()

  def run(
    self, session_id: str, action_text: str, category: str | None = None
  ) -> PlayerActionResponse:
    result = self.graph.invoke(
      {
        "session_id": session_id,
        "action_text": action_text.strip(),
        "category": category,
      }
    )
    return result["response"]

  @staticmethod
  def validate_action_node(state: WorkflowState) -> dict[str, Any]:
    text = (state.get("action_text") or "").strip()
    if len(text) < 3:
      raise InvalidActionError()
    if len(text) > 500:
      raise InvalidActionError("Action is too long (max 500 characters)")
    return {"action_text": text}

  def load_session_node(self, state: WorkflowState) -> dict[str, Any]:
    game_state = self.repo.get_state(state["session_id"])
    if game_state.game_over:
      raise InvalidActionError("Game is already over. Reset to play again.")
    previous = self.repo.get_previous_actions(state["session_id"])
    return {"game_state": game_state, "previous_actions": previous}

  def similarity_check_node(self, state: WorkflowState) -> dict[str, Any]:
    similarity = self.similarity.check_repetition(
      state["action_text"], state.get("previous_actions", [])
    )
    warning = None
    if similarity.is_repeated:
      warning = (
        f"Strategy repeat detected (similarity {similarity.max_similarity:.0%}). "
        "Try a different approach!"
      )
    return {"similarity": similarity, "strategy_warning": warning}

  def score_calculation_node(self, state: WorkflowState) -> dict[str, Any]:
    score = self.scoring.calculate(
      state["action_text"],
      state["game_state"].enemy,
      state["similarity"],
    )
    return {"score": score}

  def llm_feedback_node(self, state: WorkflowState) -> dict[str, Any]:
    enemy = state["game_state"].enemy
    feedback = self.llm.generate_feedback(
      state["action_text"],
      enemy,
      state["score"],
      state["similarity"],
    )
    return {"feedback": feedback}

  def update_state_node(self, state: WorkflowState) -> dict[str, Any]:
    gs = state["game_state"]
    damage = state["score"].final_score
    new_health = max(0, gs.enemy.health - damage)
    gs.enemy = gs.enemy.model_copy(update={"current_health": new_health})
    gs.player_score += damage
    gs.turn_count += 1
    gs.game_over = new_health <= 0
    gs.victory = gs.game_over

    history_item = self.repo.new_history_item(
      action_text=state["action_text"],
      score=damage,
      enemy_health_after=new_health,
      is_repeated=state["similarity"].is_repeated,
      category=state.get("category"),
    )
    self.repo.append_history(history_item, gs.session_id)
    self.repo.save_state(gs)

    return {"game_state": gs, "history_item": history_item}

  @staticmethod
  def response_node(state: WorkflowState) -> dict[str, Any]:
    gs = state["game_state"]
    response = PlayerActionResponse(
      session_id=gs.session_id,
      feedback=state["feedback"],
      score=state["score"],
      similarity=state["similarity"],
      enemy_health=gs.enemy.health,
      player_score=gs.player_score,
      strategy_warning=state.get("strategy_warning"),
      history_item=state["history_item"],
      game_over=gs.game_over,
      victory=gs.victory,
    )
    return {"response": response}
