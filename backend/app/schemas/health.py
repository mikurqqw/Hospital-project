from pydantic import BaseModel
from datetime import datetime

class HealthDataCreate(BaseModel):
    height: float
    weight: float
    age: int
    gender: str
    activity_level: str
    sport_type: str

class HealthDataResponse(HealthDataCreate):
    id: int
    user_id: int
    bmi: float
    recorded_at: datetime

    class Config:
        from_attributes = True