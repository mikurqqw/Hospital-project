from pydantic import BaseModel
from typing import List

class MessageItem(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: List[MessageItem] = []

class ChatResponse(BaseModel):
    response: str