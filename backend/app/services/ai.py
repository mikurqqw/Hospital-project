import base64
from typing import Literal

import httpx
from fastapi import HTTPException
from pydantic import BaseModel, Field, ValidationError

from app.core.config import settings

DISCLAIMER = "⚠️ Демонстрационный ответ ИИ, не медицинский диагноз. Обратитесь к врачу."
INSTRUCTION = (
    "Ты учебный помощник AI Health. Отвечай по-русски. "
    "Не представляйся врачом, не ставь диагнозы и не назначай лечение. "
    "При опасных симптомах рекомендуй немедленно обратиться за экстренной помощью. "
    "Не делай вывод о наличии или отсутствии болезни по изображению. "
    "Используй только общую образовательную информацию."
)


class Message(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(min_length=1, max_length=12000)


class Part(BaseModel):
    text: str = ""
    thought: bool = False


class Content(BaseModel):
    parts: list[Part] = []


class Candidate(BaseModel):
    content: Content = Field(default_factory=Content)
    finishReason: str = ""


class Generation(BaseModel):
    candidates: list[Candidate] = []


async def generate(
    messages: list[Message], *, image: bytes | None = None, mime_type: str = "image/png"
) -> str:
    key = settings.GEMINI_API_KEY.get_secret_value()
    if not key:
        raise HTTPException(503, "ИИ не настроен: добавьте GEMINI_API_KEY в Render.")
    contents: list[dict[str, object]] = [
        {
            "role": "model" if message.role == "assistant" else "user",
            "parts": [{"text": message.content}],
        }
        for message in messages
    ]
    if image:
        contents[-1] = {
            "role": "user",
            "parts": [
                {"text": messages[-1].content},
                {
                    "inlineData": {
                        "mimeType": mime_type,
                        "data": base64.b64encode(image).decode("ascii"),
                    }
                },
            ],
        }
    payload = {
        "systemInstruction": {"parts": [{"text": INSTRUCTION}]},
        "contents": contents,
        "generationConfig": {"temperature": 0.3, "maxOutputTokens": 2048},
    }
    try:
        async with httpx.AsyncClient(timeout=settings.AI_TIMEOUT_SECONDS) as client:
            response = await client.post(
                f"https://generativelanguage.googleapis.com/v1beta/models/{settings.GEMINI_MODEL}:generateContent",
                headers={"x-goog-api-key": key},
                json=payload,
            )
        if response.status_code == 429:
            raise HTTPException(429, "Лимит бесплатного ИИ исчерпан. Повторите позже.")
        if response.status_code in (400, 401, 403, 404):
            raise HTTPException(
                503, "Проверьте ключ, модель и доступность Gemini в Render."
            )
        response.raise_for_status()
        result = Generation.model_validate(response.json())
    except httpx.TimeoutException as error:
        raise HTTPException(504, "ИИ не ответил вовремя. Повторите позже.") from error
    except (httpx.HTTPError, ValueError, ValidationError) as error:
        raise HTTPException(502, "Сервис ИИ временно недоступен.") from error
    if not result.candidates or result.candidates[0].finishReason in {
        "SAFETY",
        "RECITATION",
        "PROHIBITED_CONTENT",
    }:
        raise HTTPException(
            422, "ИИ не смог безопасно обработать запрос. Измените его."
        )
    answer = "".join(
        part.text for part in result.candidates[0].content.parts if not part.thought
    ).strip()
    if not answer:
        raise HTTPException(502, "ИИ вернул пустой ответ. Повторите запрос.")
    return f"{answer}\n\n{DISCLAIMER}"
