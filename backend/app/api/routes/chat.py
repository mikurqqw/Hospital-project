from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
import ollama
from pydantic import BaseModel
from typing import List
# ИМПОРТИРУЕМ SessionLocal для независимой сессии
from app.core.database import get_db, SessionLocal 
from app.models.user import User
from app.models.health_data import HealthData
from app.models.chat_history import ChatMessage
from app.api.deps import get_current_user

router = APIRouter()

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str

@router.get("/history", response_model=List[Message])
def get_history(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    messages = db.query(ChatMessage).filter(ChatMessage.user_id == current_user.id).order_by(ChatMessage.created_at.asc()).all()
    return [{"role": msg.role, "content": msg.content} for msg in messages]

@router.post("/message")
def send_message(request: ChatRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        user_msg = ChatMessage(user_id=current_user.id, role="user", content=request.message)
        db.add(user_msg)
        db.commit()

        health = db.query(HealthData).filter(HealthData.user_id == current_user.id).order_by(HealthData.recorded_at.desc()).first()
        ctx = f"Пациент: {health.weight}кг, {health.height}см, спорт: {health.sport_type}." if health else ""
        history = db.query(ChatMessage).filter(ChatMessage.user_id == current_user.id).order_by(ChatMessage.created_at.asc()).limit(10).all()
        
        instruction = (
            f"ИНСТРУКЦИЯ: Ты — эмпатичный ИИ-консультант 'AI Health'. "
            f"Дай подробный, полезный ответ. Посоветуй, к какому врачу пойти. "
            f"Отвечай ТОЛЬКО на русском языке. "
            f"В конце ВСЕГДА добавляй: '⚠️ Информация носит ознакомительный характер. Обязательно обратитесь к врачу.' "
            f"{ctx}"
        )
        
        messages = [{"role": "system", "content": instruction}]
        for msg in history:
            messages.append({"role": msg.role, "content": msg.content})

        def generate_response():
            full_response = ""
            for chunk in ollama.chat(model='qwen', messages=messages, stream=True):
                text = chunk['message']['content']
                full_response += text
                yield text
            
            # БЕЗОПАСНОЕ СОХРАНЕНИЕ В БД:
            db_session = SessionLocal()
            try:
                ai_msg = ChatMessage(user_id=current_user.id, role="assistant", content=full_response.strip())
                db_session.add(ai_msg)
                db_session.commit()
            except Exception as e:
                print(f"Ошибка сохранения чата: {e}")
            finally:
                db_session.close()

        return StreamingResponse(generate_response(), media_type="text/plain")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/history")
def clear_history(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db.query(ChatMessage).filter(ChatMessage.user_id == current_user.id).delete()
    db.commit()
    return {"status": "ok"}