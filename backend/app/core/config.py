from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

_BACKEND_DIR = Path(__file__).resolve().parents[2]
_ENV_FILE = _BACKEND_DIR / ".env"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=str(_ENV_FILE) if _ENV_FILE.is_file() else None,
        env_file_encoding="utf-8",
        extra="ignore",
    )

    environment: str = "development"
    database_url: str = "sqlite:///./data/game.db"
    cors_origins: str = "http://localhost:4200,http://127.0.0.1:4200"

    openai_api_key: str | None = None
    langchain_api_key: str | None = None
    langchain_tracing_v2: bool = False
    langchain_project: str = "ai-word-battle"

    similarity_threshold: float = 0.75
    use_mock_llm: bool = False

    admin_email: str | None = None
    admin_password: str | None = None
    jwt_secret: str = "change-me-in-production-use-long-random-string"
    jwt_expire_hours: int = 12
    frontend_url: str = "http://localhost:4200"

    smtp_host: str | None = None
    smtp_port: int = 587
    smtp_user: str | None = None
    smtp_password: str | None = None
    smtp_from_email: str | None = None
    smtp_use_tls: bool = True

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    @property
    def llm_enabled(self) -> bool:
        return bool(self.openai_api_key) and not self.use_mock_llm

    @property
    def mail_from(self) -> str:
        return self.smtp_from_email or self.smtp_user or "noreply@memorywords.local"

    @property
    def smtp_configured(self) -> bool:
        return bool(self.smtp_host and self.mail_from)


@lru_cache
def get_settings() -> Settings:
    return Settings()
