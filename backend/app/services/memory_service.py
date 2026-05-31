from __future__ import annotations

from app.repositories.memory_repository import MemoryRepository
from app.schemas.memory import (
  LevelConfig,
  MemoryGuessRequest,
  MemoryGuessResponse,
  MemoryRoundResponse,
  MemoryStartRequest,
  MemoryStartResponse,
)
from app.services.memory_level_service import MemoryLevelService
from app.services.memory_word_service import MemoryWordService


class MemoryService:
  def __init__(self):
    self.repo = MemoryRepository()
    self.levels = MemoryLevelService()
    self.words = MemoryWordService()

  def list_categories(self):
    return self.words.list_categories()

  def start(self, request: MemoryStartRequest) -> MemoryStartResponse:
    category_id = self.words.resolve_category(request.category_id)
    state = self.repo.create(request.player_name or "Player", category_id=category_id)
    label = self.words.category_label(category_id)
    return MemoryStartResponse(
      session_id=state.session_id,
      level=state.level,
      total_score=state.total_score,
      category_id=category_id,
      category_label=label,
      message=f"Category: {label}. Memorize the words, then find them in the grid.",
    )

  def start_round(self, session_id: str) -> MemoryRoundResponse:
    state = self.repo.get(session_id)
    cfg = self.levels.config_for_level(state.level)
    targets, choices = self.words.build_round(
      state.category_id,
      cfg.word_count,
      cfg.choice_count,
    )
    state.current_targets = targets
    state.round_active = True
    self.repo.save(state)
    label = self.words.category_label(state.category_id)
    return MemoryRoundResponse(
      session_id=session_id,
      level=state.level,
      category_id=state.category_id,
      category_label=label,
      level_config=cfg,
      memorize_words=targets,
      memorize_seconds=cfg.memorize_seconds,
      guess_seconds=self.levels.guess_seconds(state.level),
      pass_threshold=self.levels.pass_threshold(state.level),
      choices=choices,
    )

  def submit_guess(self, request: MemoryGuessRequest) -> MemoryGuessResponse:
    state = self.repo.get(request.session_id)
    if not state.round_active or not state.current_targets:
      raise ValueError("No active round — start a round first")

    targets = state.current_targets
    selected_lower = {w.strip().lower() for w in request.selected_words if w.strip()}

    hits = sorted([t for t in targets if t.lower() in selected_lower])
    misses = sorted([t for t in targets if t.lower() not in selected_lower])
    false_picks = sorted(
      [w for w in request.selected_words if w.strip().lower() not in {t.lower() for t in targets}]
    )
    targets_lower = {t.lower() for t in targets}

    accuracy = len(hits) / len(targets_lower) if targets_lower else 0.0
    guess_sec = self.levels.guess_seconds(state.level)
    score = self.levels.score_round(
      state.level,
      len(hits),
      len(targets_lower),
      request.time_remaining_ms,
      guess_sec,
    )
    passed = accuracy >= self.levels.pass_threshold(state.level)
    level_up = passed
    next_level = state.level + 1 if level_up else state.level

    state.total_score += score
    state.round_active = False
    state.current_targets = []

    if level_up:
      state.level = next_level
      msg = f"Level cleared! +{score} points. Ready for level {next_level}?"
    else:
      msg = f"Need {int(self.levels.pass_threshold(state.level)*100)}% accuracy. +{score} points. Try again!"

    self.repo.save(state)

    next_round = None
    if level_up:
      next_round = self.start_round(state.session_id)

    return MemoryGuessResponse(
      session_id=state.session_id,
      level=state.level if level_up else state.level,
      correct_words=sorted(targets),
      selected_words=request.selected_words,
      hits=hits,
      misses=misses,
      false_picks=false_picks,
      score_earned=score,
      total_score=state.total_score,
      accuracy=round(accuracy, 3),
      passed=passed,
      level_up=level_up,
      next_level=next_level,
      message=msg,
      next_round=next_round,
    )

  def level_config(self, level: int) -> LevelConfig:
    return self.levels.config_for_level(level)

  def guess_seconds(self, level: int) -> float:
    return self.levels.guess_seconds(level)
