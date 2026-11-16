import secrets
from typing import Literal

from pydantic import Field, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    PROJECT_NAME: str = "AI Health"
    SECRET_KEY: str = Field(
        default_factory=lambda: secrets.token_urlsafe(48), min_length=32
    )
    ALGORITHM: Literal["HS256"] = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=60, ge=1, le=1440)
    BACKEND_CORS_ORIGINS: list[str] = ["http://localhost:5173", "http://127.0.0.1:5173"]
    DATABASE_URL: str = "sqlite:///./demo.db"
    GEMINI_API_KEY: SecretStr = SecretStr("")
    GEMINI_MODEL: str = Field(
        default="gemini-3.5-flash-lite", pattern=r"^[a-zA-Z0-9.-]+$"
    )
    AI_TIMEOUT_SECONDS: float = Field(default=45, ge=1, le=120)
    DEMO_MODE: bool = True


settings = Settings()
