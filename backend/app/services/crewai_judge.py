"""
Optional CrewAI multi-agent extension (advanced).

Enable by installing crewai and wiring into workflow_service.
MVP uses LangGraph + single LLM feedback node instead.
"""

from __future__ import annotations


def crewai_enabled() -> bool:
  try:
    import crewai  # noqa: F401

    return True
  except ImportError:
    return False


def run_judge_crew(action_text: str) -> dict:
  """Placeholder for Judge / Enemy / Narrator agents."""
  raise NotImplementedError(
    "CrewAI is optional. Install crewai and implement agents for advanced mode."
  )
