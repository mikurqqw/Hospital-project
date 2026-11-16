from typing import Annotated

from fastapi import APIRouter, Depends
from fastapi.responses import PlainTextResponse
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.chat_history import ChatMessage
from app.models.user import User
from app.services.ai import Message, generate

router = APIRouter()


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=4000, pattern=r"\S")


@router.get("/history", response_model=list[Message])
def get_history(
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> list[Message]:
    records = (
        db.query(ChatMessage)
        .filter(ChatMessage.user_id == current_user.id)
        .order_by(ChatMessage.id)
        .all()
    )
    return [
        Message.model_validate({"role": record.role, "content": record.content})
        for record in records
    ]


@router.post("/message", response_class=PlainTextResponse)
async def send_message(
    request: ChatRequest,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> str:
    records = (
        db.query(ChatMessage)
        .filter(ChatMessage.user_id == current_user.id)
        .order_by(ChatMessage.id.desc())
        .limit(10)
        .all()
    )
    messages = [
        Message.model_validate({"role": record.role, "content": record.content})
        for record in reversed(records)
    ]
    messages.append(Message(role="user", content=request.message))
    # Complete upstream generation before sending HTTP 200 so errors reach the UI.
    answer = await generate(messages)
    db.add_all(
        [
            ChatMessage(user_id=current_user.id, role="user", content=request.message),
            ChatMessage(user_id=current_user.id, role="assistant", content=answer),
        ]
    )
    db.commit()
    return answer


@router.delete("/history")
def clear_history(
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> dict[str, str]:
    db.query(ChatMessage).filter(ChatMessage.user_id == current_user.id).delete()
    db.commit()
    return {"status": "ok"}
