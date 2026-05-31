from __future__ import annotations

from pydantic import BaseModel, EmailStr, Field


class ContactRequest(BaseModel):
  name: str = Field(min_length=2, max_length=80)
  email: EmailStr
  message: str = Field(min_length=10, max_length=2000)


class SuggestionRequest(BaseModel):
  name: str = Field(min_length=2, max_length=80)
  email: EmailStr | None = None
  suggestion: str = Field(min_length=10, max_length=2000)


class FeedbackResponse(BaseModel):
  ok: bool = True
  message: str = "Thank you! We received your message."
