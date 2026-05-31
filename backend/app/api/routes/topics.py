import json
from pathlib import Path

from fastapi import APIRouter

router = APIRouter(tags=["topics"])
TOPICS_PATH = Path(__file__).resolve().parents[3] / "data" / "topics.json"


@router.get("/topics")
def list_topics():
  with open(TOPICS_PATH, encoding="utf-8") as f:
    return json.load(f)
