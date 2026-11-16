from io import BytesIO
from unittest.mock import AsyncMock

import pytest
from PIL import Image

from app.api.routes import chat, diagnostics, quiz, symptoms
from app.core.rate_limit import windows
from conftest import login


def test_health_and_spa(client):
    response = client.get("/api/healthz")
    assert response.status_code == 200
    assert response.headers["x-content-type-options"] == "nosniff"
    assert client.get("/api/missing").status_code == 404
    assert client.get("/chat").status_code == 200


def test_auth_validation(client):
    assert client.get("/api/chat/history").status_code == 401
    assert client.post("/api/auth/register", json={"email": "broken"}).status_code == 422
    headers = login(client)
    assert client.get("/api/chat/history", headers=headers).json() == []
    assert client.get("/api/chat/history", headers={"Authorization": "Bearer invalid"}).status_code == 401
    assert client.post("/api/auth/login", json={"email": "demo@example.com", "password": "wrong-pass"}).status_code == 401
    assert client.post("/api/auth/register", json={"email": "demo@example.com", "password": "demo-pass-123", "full_name": "Demo"}).status_code == 400


def test_chat_history_ownership(client, monkeypatch):
    headers = login(client)
    second = login(client, "second@example.com")
    generate = AsyncMock(return_value="Educational answer")
    monkeypatch.setattr(chat, "generate", generate)
    for index in range(6):
        assert client.post("/api/chat/message", headers=headers, json={"message": f"Question {index}"}).status_code == 200
    messages = generate.call_args.args[0]
    assert messages[-1].content == "Question 5"
    assert messages[0].content == "Question 0"
    windows.clear()
    assert client.get("/api/chat/history", headers=second).json() == []
    assert len(client.get("/api/chat/history", headers=headers).json()) == 12
    assert client.delete("/api/chat/history", headers=second).status_code == 200
    assert len(client.get("/api/chat/history", headers=headers).json()) == 12
    assert client.delete("/api/chat/history", headers=headers).status_code == 200
    assert client.get("/api/chat/history", headers=headers).json() == []


def test_ai_not_configured_is_explicit(client):
    headers = login(client)
    response = client.post("/api/chat/message", headers=headers, json={"message": "Hello"})
    assert response.status_code == 503
    assert client.get("/api/chat/history", headers=headers).json() == []


def test_health_validation_and_ownership(client):
    headers = login(client)
    second = login(client, "second@example.com")
    data = {"height": 180, "weight": 75, "age": 25, "gender": "male", "activity_level": "medium"}
    response = client.post("/api/health/", json=data, headers=headers)
    assert response.status_code == 200
    assert response.json()["bmi"] == 23.1
    assert client.get("/api/health/", headers=second).json() == []
    assert client.post("/api/health/", json={**data, "height": 0}, headers=headers).status_code == 422


def test_symptoms_and_quiz(client, monkeypatch):
    headers = login(client)
    monkeypatch.setattr(symptoms, "generate", AsyncMock(return_value="General information"))
    monkeypatch.setattr(quiz, "generate", AsyncMock(return_value="General tip"))
    assert client.post("/api/symptoms/check", json={"symptoms": []}, headers=headers).status_code == 422
    assert client.post("/api/symptoms/check", json={"symptoms": ["Headache"]}, headers=headers).json()["analysis"] == "General information"
    data = {"quiz_type": "sleep", "answers": {}, "score": 1, "total": 2}
    assert client.post("/api/quiz/submit", json=data, headers=headers).status_code == 200
    assert client.post("/api/quiz/submit", json={**data, "total": 0}, headers=headers).status_code == 422
    assert client.post("/api/quiz/submit", json={**data, "score": 3}, headers=headers).status_code == 422


def test_image_validation(client, monkeypatch):
    headers = login(client)
    assert client.post("/api/diagnostics/image", files={"file": ("bad.png", b"bad", "image/png")}, headers=headers).status_code == 415
    assert client.post("/api/diagnostics/image", files={"file": ("big.png", b"x" * (5 * 1024 * 1024 + 1))}, headers=headers).status_code == 413
    monkeypatch.setattr(diagnostics, "generate", AsyncMock(return_value="Image description"))
    buffer = BytesIO()
    Image.new("RGB", (16, 16)).save(buffer, format="PNG")
    response = client.post("/api/diagnostics/image", files={"file": ("demo.png", buffer.getvalue())}, headers=headers)
    assert response.json()["analysis"] == "Image description"


def test_rate_limit_and_request_size(client):
    for _ in range(15):
        assert client.post("/api/auth/login", json={}).status_code == 422
    assert client.post("/api/auth/login", json={}).status_code == 429
    assert client.post("/api/auth/login", headers={"Content-Length": str(7*1024*1024)}).status_code == 413
