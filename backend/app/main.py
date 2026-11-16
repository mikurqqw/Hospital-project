from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy import text
from starlette.middleware.base import RequestResponseEndpoint
from starlette.responses import Response

from app.api.routes import auth, chat, diagnostics, health, quiz, symptoms
from app.core.config import settings
from app.core.database import Base, engine
from app.core.rate_limit import rate_limit


@asynccontextmanager
async def lifespan(application: FastAPI) -> AsyncIterator[None]:
    # Start with an empty demo database; never ship historical patient records.
    Base.metadata.create_all(bind=engine)
    yield
    engine.dispose()


app = FastAPI(title="AI Health Demo", lifespan=lifespan)
app.middleware("http")(rate_limit)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)


@app.middleware("http")
async def security_headers(
    request: Request, call_next: RequestResponseEndpoint
) -> Response:
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    if request.url.path.startswith("/api/"):
        response.headers["Cache-Control"] = "no-store"
    return response


@app.get("/api/healthz")
def readiness() -> dict[str, object]:
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))
    return {
        "status": "ok",
        "demo": settings.DEMO_MODE,
        "ai_configured": bool(settings.GEMINI_API_KEY.get_secret_value()),
    }


for name, module in [
    ("auth", auth),
    ("health", health),
    ("chat", chat),
    ("diagnostics", diagnostics),
    ("symptoms", symptoms),
    ("quiz", quiz),
]:
    app.include_router(module.router, prefix=f"/api/{name}", tags=[name])

frontend_dist = Path(__file__).resolve().parents[2] / "frontend" / "dist"
if frontend_dist.is_dir():
    app.mount("/assets", StaticFiles(directory=frontend_dist / "assets"), name="assets")

    @app.get("/{catchall:path}")
    def serve_react_app(catchall: str) -> FileResponse:
        if catchall == "api" or catchall.startswith("api/"):
            raise HTTPException(status_code=404, detail="API route not found")
        file_path = (frontend_dist / catchall).resolve()
        if not file_path.is_relative_to(frontend_dist):
            raise HTTPException(status_code=404, detail="Not found")
        if file_path.is_file():
            return FileResponse(file_path)
        return FileResponse(frontend_dist / "index.html")
