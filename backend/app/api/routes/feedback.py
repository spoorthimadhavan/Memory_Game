from __future__ import annotations

import csv
from datetime import UTC, datetime
from pathlib import Path

from fastapi import APIRouter

from app.repositories import feedback_repository as feedback_repo
from app.schemas.feedback import ContactRequest, FeedbackResponse, SuggestionRequest

router = APIRouter(prefix="/feedback", tags=["feedback"])


def _append_csv(path: Path, row: dict, fieldnames: list[str]) -> None:
  feedback_repo.DATA_DIR.mkdir(parents=True, exist_ok=True)
  write_header = not path.exists()
  with open(path, "a", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    if write_header:
      writer.writeheader()
    writer.writerow(row)


@router.post("/contact", response_model=FeedbackResponse)
def submit_contact(request: ContactRequest):
  _append_csv(
    feedback_repo.CONTACT_CSV,
    {
      "timestamp": datetime.now(UTC).isoformat(),
      "name": request.name,
      "email": str(request.email),
      "message": request.message,
    },
    ["timestamp", "name", "email", "message"],
  )
  return FeedbackResponse(message="Thanks for reaching out! Your message was saved.")


@router.post("/suggestion", response_model=FeedbackResponse)
def submit_suggestion(request: SuggestionRequest):
  _append_csv(
    feedback_repo.SUGGESTION_CSV,
    {
      "timestamp": datetime.now(UTC).isoformat(),
      "name": request.name,
      "email": str(request.email or ""),
      "suggestion": request.suggestion,
    },
    ["timestamp", "name", "email", "suggestion"],
  )
  return FeedbackResponse(message="Thanks for the idea! Your suggestion was saved.")
