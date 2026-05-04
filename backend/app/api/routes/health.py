from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.health_data import HealthData
from app.models.user import User
from app.api.deps import get_current_user
from pydantic import BaseModel
from typing import List

router = APIRouter()

class HealthDataCreate(BaseModel):
    height: float
    weight: float
    age: int
    gender: str
    activity_level: str
    sport_type: str = ""

class HealthDataResponse(HealthDataCreate):
    id: int
    bmi: float

@router.post("/", response_model=HealthDataResponse)
def create_health_data(data: HealthDataCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        bmi = round(data.weight / ((data.height / 100) ** 2), 1) if data.height > 0 else 0
        health_record = HealthData(**data.dict(), bmi=bmi, user_id=current_user.id)
        db.add(health_record)
        db.commit()
        db.refresh(health_record)
        return health_record
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/", response_model=List[HealthDataResponse])
def get_health_data(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    records = db.query(HealthData).filter(HealthData.user_id == current_user.id).order_by(HealthData.recorded_at.desc()).all()
    return records