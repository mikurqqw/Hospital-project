from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import ollama
from app.core.database import get_db
from app.models.quiz_result import QuizResult
from app.models.user import User
from app.schemas.quiz import QuizSubmitRequest, QuizResultResponse
from app.api.deps import get_current_user

router = APIRouter()

@router.post("/submit", response_model=QuizResultResponse)
async def submit_quiz(
    request: QuizSubmitRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        percentage = (request.score / request.total) * 100
        if percentage >= 80:
            level = "ОТЛИЧНЫЙ ПОКАЗАТЕЛЬ. Так держать!"
        elif percentage >= 40:
            level = "СРЕДНИЙ ПОКАЗАТЕЛЬ. Есть что улучшить."
        else:
            level = "КРИТИЧЕСКИЙ ПОКАЗАТЕЛЬ. Пора менять привычки."

        prompt = f"Напиши 1 полезный медицинский факт или совет по теме '{request.quiz_type}'. Максимум 15 слов. На русском языке."
        
        try:
            response = ollama.chat(model='qwen', messages=[{"role": "user", "content": prompt}], options={"temperature": 0.5})
            ai_tip = response['message']['content'].strip()
        except:
            ai_tip = "Пейте больше воды и спите не менее 7 часов в сутки." # Резервный совет, если ИИ упал

        final_feedback = f"Ваш результат: {request.score} из {request.total} баллов.\nСтатус: {level}\n\nСовет от AI Health:\n{ai_tip}"
        
        quiz_record = QuizResult(user_id=current_user.id, quiz_type=request.quiz_type, score=request.score, total=request.total, feedback=final_feedback)
        db.add(quiz_record)
        db.commit()
        db.refresh(quiz_record)
        return quiz_record
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка: {str(e)}")