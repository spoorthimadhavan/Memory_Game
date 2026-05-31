from __future__ import annotations

import os

from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field

from app.core.config import get_settings
from app.core.logging import get_logger
from app.schemas.answer import AIFeedback, EvaluationResult
from app.schemas.question import Question
from app.schemas.score import ScoreBreakdown

logger = get_logger(__name__)

EXPLAIN_PROMPT = ChatPromptTemplate.from_messages(
  [
    (
      "system",
      "You are a supportive technical tutor. Give a clear, professional explanation in 2-3 sentences. "
      "Correct misconceptions gently. Mention what the learner did well. Max 80 words.",
    ),
    (
      "human",
      "Topic: {topic}\nQuestion: {question}\nLearner answer: {answer}\n"
      "Quality: {quality}\nMatched concepts: {matched}\nWrite tutor feedback.",
    ),
  ]
)


class ExplanationOutput(BaseModel):
  narrative: str
  tone: str = "neutral"
  highlights: list[str] = Field(default_factory=list)


class LLMService:
  def __init__(self):
    self.settings = get_settings()
    self._configure_tracing()

  def _configure_tracing(self) -> None:
    if self.settings.langchain_tracing_v2 and self.settings.langchain_api_key:
      os.environ["LANGCHAIN_TRACING_V2"] = "true"
      os.environ["LANGCHAIN_API_KEY"] = self.settings.langchain_api_key
      os.environ["LANGCHAIN_PROJECT"] = self.settings.langchain_project

  def generate_explanation(
    self,
    question: Question,
    answer_text: str,
    evaluation: EvaluationResult,
    score: ScoreBreakdown,
  ) -> AIFeedback:
    if not self.settings.llm_enabled:
      return self._mock_explanation(question, answer_text, evaluation, score)

    try:
      llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.5, api_key=self.settings.openai_api_key)
      chain = EXPLAIN_PROMPT | llm.with_structured_output(ExplanationOutput)
      result: ExplanationOutput = chain.invoke(
        {
          "topic": question.topic,
          "question": question.text,
          "answer": answer_text,
          "quality": evaluation.quality,
          "matched": ", ".join(evaluation.matched_concepts) or "none",
        }
      )
      tone = result.tone if result.tone in ("positive", "neutral", "warning") else "neutral"
      return AIFeedback(narrative=result.narrative, tone=tone, highlights=result.highlights[:4])
    except Exception as exc:
      logger.warning("llm_explanation_fallback error=%s", exc)
      return self._mock_explanation(question, answer_text, evaluation, score)

  def _mock_explanation(
    self,
    question: Question,
    answer_text: str,
    evaluation: EvaluationResult,
    score: ScoreBreakdown,
  ) -> AIFeedback:
    if evaluation.quality == "strong":
      text = (
        f"Strong answer. You covered key ideas for “{question.mission_title}” "
        f"and earned {score.final_score} XP."
      )
      tone = "positive"
      highlights = ["mastery"]
    elif evaluation.quality == "partial":
      text = (
        f"Good start. You touched some concepts, but expand on: "
        f"{', '.join(question.expected_concepts[:3])}. "
        f"You earned {score.final_score} XP."
      )
      tone = "neutral"
      highlights = ["review"]
    else:
      text = (
        f"Let's reinforce this topic. Review the core ideas and try a more specific answer. "
        f"Hint: {question.hint or 'Add an example.'} (+{score.final_score} XP for effort.)"
      )
      tone = "warning"
      highlights = ["study"]

    if evaluation.repeated_mistake:
      text += " You repeated a similar weak pattern — vary your explanation."

    return AIFeedback(narrative=text, tone=tone, highlights=highlights)
