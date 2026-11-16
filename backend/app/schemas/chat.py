from pydantic import BaseModel


class MessageItem(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str
    history: list[MessageItem] = []


class ChatResponse(BaseModel):
    response: str
