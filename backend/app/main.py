import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.core.database import engine, Base

# Импортируем роутеры
from app.api.routes import auth, health, chat, diagnostics, symptoms, quiz

Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Health")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Роуты
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(health.router, prefix="/api/health", tags=["health"]) 
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(diagnostics.router, prefix="/api/diagnostics", tags=["diagnostics"])
app.include_router(symptoms.router, prefix="/api/symptoms", tags=["symptoms"])
app.include_router(quiz.router, prefix="/api/quiz", tags=["quiz"])

# --- ИНТЕГРАЦИЯ ФРОНТЕНДА (ОДИН СЕРВЕР) ---
# Получаем абсолютный путь к папке frontend/dist
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROJECT_ROOT = os.path.dirname(BASE_DIR)
frontend_dist = os.path.join(PROJECT_ROOT, "frontend", "dist")

if os.path.exists(frontend_dist):
    # 1. Раздаем статические файлы (JS, CSS, картинки) из папки assets
    assets_path = os.path.join(frontend_dist, "assets")
    if os.path.exists(assets_path):
        app.mount("/assets", StaticFiles(directory=assets_path), name="assets")

    # 2. Раздаем остальные файлы и перенаправляем на index.html для работы React Router
    @app.get("/{catchall:path}")
    def serve_react_app(catchall: str):
        # Защита: если запрос начинается с /api/, но роута нет — выдаем 404 ошибку API, а не HTML страницу
        if catchall.startswith("api/"):
            raise HTTPException(status_code=404, detail="API route not found")
        
        # Если запрашивается конкретный файл в корне (например, favicon.png)
        file_path = os.path.join(frontend_dist, catchall)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        
        # Для всех остальных путей (например, /profile, /chat) отдаем index.html
        return FileResponse(os.path.join(frontend_dist, "index.html"))
else:
    print("ВНИМАНИЕ: Папка frontend/dist не найдена. Скрипт start.bat соберет её автоматически.")