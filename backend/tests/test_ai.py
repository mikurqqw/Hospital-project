import asyncio
from unittest.mock import AsyncMock

import httpx
import pytest
from fastapi import HTTPException
from pydantic import SecretStr

from app.core.config import settings
from app.services.ai import Message, generate


@pytest.mark.parametrize("status,expected", [(429,429),(401,503),(403,503),(404,503),(400,503),(500,502)])
def test_provider_errors(monkeypatch, status, expected):
    monkeypatch.setattr(settings, "GEMINI_API_KEY", SecretStr("test-key"))
    response = httpx.Response(status, request=httpx.Request("POST", "https://example.com"))
    monkeypatch.setattr(httpx.AsyncClient, "post", AsyncMock(return_value=response))
    with pytest.raises(HTTPException) as error:
        asyncio.run(generate([Message(role="user", content="Test")]))
    assert error.value.status_code == expected


@pytest.mark.parametrize("body", [{}, {"candidates": [{"finishReason": "SAFETY"}]}, {"candidates": [{"content": {"parts": []}}]}])
def test_empty_or_blocked(monkeypatch, body):
    monkeypatch.setattr(settings, "GEMINI_API_KEY", SecretStr("test-key"))
    response = httpx.Response(200, request=httpx.Request("POST", "https://example.com"), json=body)
    monkeypatch.setattr(httpx.AsyncClient, "post", AsyncMock(return_value=response))
    with pytest.raises(HTTPException):
        asyncio.run(generate([Message(role="user", content="Test")]))


def test_image_and_response(monkeypatch):
    monkeypatch.setattr(settings, "GEMINI_API_KEY", SecretStr("test-key"))
    response = httpx.Response(200, request=httpx.Request("POST", "https://example.com"), json={"candidates": [{"content": {"parts": [{"text": "hidden", "thought": True}, {"text": "Answer"}]}}]})
    post = AsyncMock(return_value=response)
    monkeypatch.setattr(httpx.AsyncClient, "post", post)
    answer = asyncio.run(generate([Message(role="user", content="Test")], image=b"demo"))
    assert "Answer" in answer and "hidden" not in answer
    assert post.call_args.kwargs["json"]["contents"][0]["parts"][1]["inlineData"]["data"] == "ZGVtbw=="


def test_timeout(monkeypatch):
    monkeypatch.setattr(settings, "GEMINI_API_KEY", SecretStr("test-key"))
    monkeypatch.setattr(httpx.AsyncClient, "post", AsyncMock(side_effect=httpx.ReadTimeout("timeout")))
    with pytest.raises(HTTPException) as error:
        asyncio.run(generate([Message(role="user", content="Test")]))
    assert error.value.status_code == 504
