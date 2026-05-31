from __future__ import annotations

from typing import Any, TypedDict

from langgraph.graph import END, StateGraph

from app.core.exceptions import InvalidActionError
from app.repositories.quest_repository import QuestRepository
from app.schemas.answer import AIFeedback, AnswerResponse, EvaluationResult
from app.schemas.quest import AnswerHistoryItem, QuestState
from app.schemas.question import Question
from app.schemas.score import ScoreBreakdown
from app.services.evaluation_service import EvaluationService
from app.services.llm_service import LLMService
from app.services.question_service import QuestionService
from app.services.scoring_service import ScoringService


class WorkflowState(TypedDict, total=False):
  session_id: str
  question_id: str
  answer_text: str
  quest_state: QuestState
  answered_question: Question
  evaluation: EvaluationResult
  score: ScoreBreakdown
  explanation: AIFeedback
  level_up: bool
  weak_topic_warning: str | None
  next_question: Question
  history_item: AnswerHistoryItem
  response: AnswerResponse


class QuestWorkflow:
  def __init__(self):
    self.repo = QuestRepository()
    self.evaluator = EvaluationService()
    self.scoring = ScoringService()
    self.llm = LLMService()
    self.questions = QuestionService()
    self.graph = self._build_graph()

  def _build_graph(self):
    graph = StateGraph(WorkflowState)
    graph.add_node("validate_answer", self.validate_answer_node)
    graph.add_node("load_session", self.load_session_node)
    graph.add_node("evaluate_answer", self.evaluate_answer_node)
    graph.add_node("score_calculation", self.score_calculation_node)
    graph.add_node("llm_explanation", self.llm_explanation_node)
    graph.add_node("adapt_difficulty", self.adapt_difficulty_node)
    graph.add_node("generate_next_question", self.generate_next_question_node)
    graph.add_node("update_state", self.update_state_node)
    graph.add_node("response", self.response_node)

    graph.set_entry_point("validate_answer")
    graph.add_edge("validate_answer", "load_session")
    graph.add_edge("load_session", "evaluate_answer")
    graph.add_edge("evaluate_answer", "score_calculation")
    graph.add_edge("score_calculation", "llm_explanation")
    graph.add_edge("llm_explanation", "adapt_difficulty")
    graph.add_edge("adapt_difficulty", "generate_next_question")
    graph.add_edge("generate_next_question", "update_state")
    graph.add_edge("update_state", "response")
    graph.add_edge("response", END)
    return graph.compile()

  def run(self, session_id: str, question_id: str, answer_text: str) -> AnswerResponse:
    result = self.graph.invoke(
      {
        "session_id": session_id,
        "question_id": question_id,
        "answer_text": answer_text.strip(),
      }
    )
    return result["response"]

  @staticmethod
  def validate_answer_node(state: WorkflowState) -> dict[str, Any]:
    text = (state.get("answer_text") or "").strip()
    if len(text) < 2:
      raise InvalidActionError("Answer is too short")
    if len(text) > 2000:
      raise InvalidActionError("Answer is too long")
    return {"answer_text": text}

  def load_session_node(self, state: WorkflowState) -> dict[str, Any]:
    qs = self.repo.get_state(state["session_id"])
    if qs.current_question.id != state["question_id"]:
      raise InvalidActionError("Question expired — refresh and use the current mission")
    return {"quest_state": qs, "answered_question": qs.current_question.model_copy()}

  def evaluate_answer_node(self, state: WorkflowState) -> dict[str, Any]:
    q = state["quest_state"].current_question
    weak = self.repo.get_weak_answers(state["session_id"])
    evaluation = self.evaluator.evaluate(
      state["answer_text"],
      q.expected_concepts,
      weak,
    )
    warning = None
    if evaluation.repeated_mistake:
      warning = "Similar weak answers detected — review core concepts before continuing."
    return {"evaluation": evaluation, "weak_topic_warning": warning}

  def score_calculation_node(self, state: WorkflowState) -> dict[str, Any]:
    qs = state["quest_state"]
    score = self.scoring.calculate(
      state["evaluation"],
      qs.difficulty,
      qs.streak,
    )
    return {"score": score}

  def llm_explanation_node(self, state: WorkflowState) -> dict[str, Any]:
    explanation = self.llm.generate_explanation(
      state["quest_state"].current_question,
      state["answer_text"],
      state["evaluation"],
      state["score"],
    )
    return {"explanation": explanation}

  def adapt_difficulty_node(self, state: WorkflowState) -> dict[str, Any]:
    qs = state["quest_state"]
    ev = state["evaluation"]
    score = state["score"]

    qs.xp += score.final_score
    qs.missions_completed += 1

    if ev.quality == "strong":
      qs.streak += 1
      qs.difficulty = min(2.0, round(qs.difficulty + 0.1, 2))
    else:
      qs.streak = 0
      if ev.quality == "weak":
        qs.difficulty = max(1.0, round(qs.difficulty - 0.15, 2))
        for c in ev.matched_concepts:
          if c not in qs.weak_concepts:
            qs.weak_concepts.append(c)
        for c in state["quest_state"].current_question.expected_concepts[:2]:
          if c not in qs.weak_concepts:
            qs.weak_concepts.append(c)

    old_level = qs.level
    xp_needed = qs.level * 40
    level_up = qs.xp >= xp_needed
    if level_up:
      qs.level += 1
      qs.xp = max(0, qs.xp - xp_needed)

    return {"quest_state": qs, "level_up": level_up and qs.level > old_level}

  def generate_next_question_node(self, state: WorkflowState) -> dict[str, Any]:
    qs = state["quest_state"]
    next_q = self.questions.generate(qs.topic, qs.level, qs.difficulty)
    return {"next_question": next_q}

  def update_state_node(self, state: WorkflowState) -> dict[str, Any]:
    qs = state["quest_state"]
    history_item = self.repo.new_history_item(
      question=state["answered_question"],
      answer_text=state["answer_text"],
      score=state["score"].final_score,
      quality=state["evaluation"].quality,
      level=qs.level,
    )
    qs.current_question = state["next_question"]
    self.repo.append_history(history_item, qs.session_id)
    self.repo.save_state(qs)
    return {"quest_state": qs, "history_item": history_item}

  @staticmethod
  def response_node(state: WorkflowState) -> dict[str, Any]:
    qs = state["quest_state"]
    response = AnswerResponse(
      session_id=qs.session_id,
      evaluation=state["evaluation"],
      score=state["score"],
      explanation=state["explanation"],
      level_up=state.get("level_up", False),
      new_level=qs.level,
      xp=qs.xp,
      streak=qs.streak,
      next_question=qs.current_question,
      weak_topic_warning=state.get("weak_topic_warning"),
      history_item=state["history_item"],
    )
    return {"response": response}
