from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Health"
    SECRET_KEY: str = "your-super-secret-key-here" 
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://127.0.0.1:5173"]
    
    # ВОТ ЭТА СТРОКА БЫЛА УТЕРЯНА:
    DATABASE_URL: str = "sqlite:///./healthcare.db" 

    class Config:
        env_file = ".env"
        extra = "ignore" 

settings = Settings()