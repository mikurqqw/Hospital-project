from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.health_data import HealthData
from app.models.user import User

router = APIRouter()


class HealthDataCreate(BaseModel):
    height: float = Field(gt=0, le=300)
    weight: float = Field(gt=0, le=700)
    age: int = Field(ge=1, le=120)
    gender: str = Field(max_length=30)
    activity_level: str = Field(max_length=30)
    sport_type: str = Field(default="", max_length=100)


class HealthDataResponse(HealthDataCreate):
    id: int
    bmi: float


@router.post("/", response_model=HealthDataResponse)
def create_health_data(
    data: HealthDataCreate,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> HealthData:
    try:
        bmi = (
            round(data.weight / ((data.height / 100) ** 2), 1) if data.height > 0 else 0
        )
        health_record = HealthData(
            **data.model_dump(), bmi=bmi, user_id=current_user.id
        )
        db.add(health_record)
        db.commit()
        db.refresh(health_record)
        return health_record
    except SQLAlchemyError as error:
        db.rollback()
        raise HTTPException(
            status_code=500, detail="Could not save health data"
        ) from error


@router.get("/", response_model=list[HealthDataResponse])
def get_health_data(
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> list[HealthData]:
    records = (
        db.query(HealthData)
        .filter(HealthData.user_id == current_user.id)
        .order_by(HealthData.recorded_at.desc())
        .all()
    )
    return records
