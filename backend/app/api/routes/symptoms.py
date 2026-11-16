from typing import Annotated

from fastapi import APIRouter, Depends

from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.symptoms import SymptomRequest, SymptomResponse
from app.services.ai import Message, generate

router = APIRouter()


@router.post("/check", response_model=SymptomResponse)
async def check_symptoms(
    request: SymptomRequest, current_user: Annotated[User, Depends(get_current_user)]
) -> SymptomResponse:
    prompt = (
        f"Симптомы: {', '.join(request.symptoms)}. "
        f"Дополнительная информация: {request.additional_info or 'нет'}. "
        "Дай общую образовательную информацию, перечисли тревожные признаки "
        "и объясни, к какому специалисту обратиться. Не ставь диагноз."
    )
    return SymptomResponse(
        analysis=await generate([Message(role="user", content=prompt)])
    )
