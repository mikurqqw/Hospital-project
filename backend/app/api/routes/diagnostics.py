from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
import ollama
from pydantic import BaseModel
from app.models.user import User
from app.api.deps import get_current_user

router = APIRouter()

class DiagnosticsResponse(BaseModel):
    analysis: str

@router.post("/image", response_model=DiagnosticsResponse)
async def analyze_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    try:
        image_bytes = await file.read()
        
        prompt = (
            "Ты — главный врач-рентгенолог в российской клинике. "
            "Опиши этот медицинский снимок ИСКЛЮЧИТЕЛЬНО на русском языке. "
            "Использовать английский язык, латиницу или транслит КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО.\n"
            "Ответь на 3 вопроса четко и профессионально:\n"
            "1. Что это за снимок (какая часть тела)?\n"
            "2. Какие патологии или отклонения видны?\n"
            "3. К какому врачу-специалисту направить пациента?"
        )
        
        response = ollama.chat(
            model='llava', 
            messages=[{'role': 'user', 'content': prompt, 'images': [image_bytes]}],
            options={"temperature": 0.1, "num_predict": 300}
        )
        
        ai_text = response['message']['content'].strip()
        final_text = f"Анализ снимка (LLaVA Vision):\n\n{ai_text}\n\n⚠️ Дисклеймер: Это не медицинский диагноз. Обратитесь к специалисту."
        
        return DiagnosticsResponse(analysis=final_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка: {str(e)}")