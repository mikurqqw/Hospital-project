from datetime import datetime
from typing import Self

from pydantic import BaseModel, ConfigDict, Field, model_validator


class QuizSubmitRequest(BaseModel):
    quiz_type: str = Field(min_length=1, max_length=100)
    answers: dict[str, str] = Field(max_length=100)
    score: int = Field(ge=0)
    total: int = Field(gt=0, le=100)

    @model_validator(mode="after")
    def validate_score(self) -> Self:
        if self.score > self.total:
            raise ValueError("Score cannot exceed total")
        return self


class QuizResultResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: int
    quiz_type: str
    score: int
    total: int
    feedback: str
    taken_at: datetime
