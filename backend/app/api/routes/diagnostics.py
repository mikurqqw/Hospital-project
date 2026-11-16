import warnings
from io import BytesIO
from typing import Annotated

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from PIL import Image, UnidentifiedImageError
from pydantic import BaseModel
from starlette.concurrency import run_in_threadpool

from app.api.deps import get_current_user
from app.models.user import User
from app.services.ai import Message, generate

router = APIRouter()
MAX_UPLOAD = 5 * 1024 * 1024


class DiagnosticsResponse(BaseModel):
    analysis: str


def validate_image(data: bytes) -> str:
    try:
        with warnings.catch_warnings():
            warnings.simplefilter("error", Image.DecompressionBombWarning)
            with Image.open(BytesIO(data)) as image:
                if image.format not in {"PNG", "JPEG", "WEBP"}:
                    raise HTTPException(415, "Допустимы PNG, JPEG и WebP.")
                if image.width * image.height > 20_000_000:
                    raise HTTPException(
                        413, "Изображение слишком большое: максимум 20 Мп."
                    )
                mime_type = Image.MIME[image.format]
                image.verify()
                return mime_type
    except (
        UnidentifiedImageError,
        OSError,
        ValueError,
        Image.DecompressionBombError,
        Image.DecompressionBombWarning,
    ) as error:
        raise HTTPException(415, "Файл не является допустимым изображением.") from error


@router.post("/image", response_model=DiagnosticsResponse)
async def analyze_image(
    file: Annotated[UploadFile, File(...)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> DiagnosticsResponse:
    image_bytes = await file.read(MAX_UPLOAD + 1)
    await file.close()
    if len(image_bytes) > MAX_UPLOAD:
        raise HTTPException(413, "Максимальный размер файла — 5 МБ.")
    mime_type = await run_in_threadpool(validate_image, image_bytes)
    prompt = (
        "Это учебная демонстрация. Опиши тип изображения и его видимые элементы. "
        "Объясни ограничения автоматического анализа. Не ищи и не подтверждай патологию. "
        "Напомни, что интерпретировать медицинские снимки должен профильный врач."
    )
    answer = await generate(
        [Message(role="user", content=prompt)], image=image_bytes, mime_type=mime_type
    )
    return DiagnosticsResponse(analysis=answer)
