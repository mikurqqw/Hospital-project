from pydantic import BaseModel
from typing import Dict
from datetime import datetime

class QuizSubmitRequest(BaseModel):
    quiz_type: str
    answers: Dict[str, str]
    score: int
    total: int

class QuizResultResponse(BaseModel):
    id: int
    user_id: int
    quiz_type: str
    score: int
    total: int
    feedback: str
    taken_at: datetime

    class Config:
        from_attributes = True