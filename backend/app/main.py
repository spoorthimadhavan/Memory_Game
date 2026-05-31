from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.routes import feedback, health, memory
from app.core.config import get_settings
from app.core.exceptions import GameException
from app.core.logging import setup_logging


@asynccontextmanager
async def lifespan(_app: FastAPI):
  setup_logging()
  try:
    from app.services.admin_service import AdminService

    AdminService().ensure_admin_from_env()
  except ImportError:
    pass
  yield


def create_app() -> FastAPI:
  settings = get_settings()
  app = FastAPI(
    title="Memory Words API",
    version="3.0.0",
    description="Interactive memory word game API",
    lifespan=lifespan,
  )

  app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
  )

  @app.exception_handler(GameException)
  async def game_exception_handler(_request: Request, exc: GameException):
    return JSONResponse(
      status_code=exc.status_code,
      content={"detail": exc.message},
    )

  app.include_router(health.router)
  app.include_router(memory.router)
  app.include_router(feedback.router)

  try:
    from app.api.routes import admin

    app.include_router(admin.router)
  except ImportError:
    pass

  return app


app = create_app()
