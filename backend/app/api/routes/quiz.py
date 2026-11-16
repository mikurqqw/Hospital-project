from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.quiz_result import QuizResult
from app.models.user import User
from app.schemas.quiz import QuizResultResponse, QuizSubmitRequest
from app.services.ai import Message, generate

router = APIRouter()


@router.post("/submit", response_model=QuizResultResponse)
async def submit_quiz(
    request: QuizSubmitRequest,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> QuizResult:
    prompt = f"Дай краткий общий образовательный совет по теме '{request.quiz_type}'. Не более 30 слов."
    tip = await generate([Message(role="user", content=prompt)])
    feedback = f"Результат учебного теста: {request.score} из {request.total}. Это не оценка здоровья.\n\n{tip}"
    record = QuizResult(
        user_id=current_user.id,
        quiz_type=request.quiz_type,
        score=request.score,
        total=request.total,
        feedback=feedback,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record
