from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import ollama
from app.schemas.symptoms import SymptomRequest, SymptomResponse
from app.models.user import User
from app.api.deps import get_current_user
from app.core.database import get_db

router = APIRouter()

@router.post("/check", response_model=SymptomResponse)
async def check_symptoms(
    request: SymptomRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        symptoms_str = ", ".join(request.symptoms)
        
        # Используем "Обучение на примере" (Few-Shot Prompting)
        prompt = (
            f"Проанализируй симптомы пациента: {symptoms_str}.\n"
            "Назови 3 возможных заболевания. ОТВЕЧАЙ СТРОГО ПО ПРИМЕРУ НИЖЕ, без лишнего текста и приветствий.\n\n"
            "ПРИМЕР ОТВЕТА:\n"
            "1. Простуда — Врач: Терапевт (Срочность: Низкая)\n"
            "2. Грипп — Врач: Инфекционист (Срочность: Средняя)\n"
            "3. Пневмония — Врач: Пульмонолог (Срочность: Высокая)\n\n"
            "ТВОЙ ОТВЕТ:"
        )
        
        response = ollama.chat(
            model='qwen', 
            messages=[{"role": "user", "content": prompt}],
            options={"temperature": 0.1}
        )
        
        raw_ai_text = response['message']['content'].strip()
        final_analysis = f"Результат AI-анализа симптомов:\n\n{raw_ai_text}\n\n⚠️ Внимание: Анализ сгенерирован ИИ и не является диагнозом. Выберите врача в разделе 'Специалисты'."
        
        return SymptomResponse(analysis=final_analysis)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка: {str(e)}")