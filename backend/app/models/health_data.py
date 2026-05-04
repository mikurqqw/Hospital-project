from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base

class HealthData(Base):
    __tablename__ = "health_data"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    height = Column(Float)
    weight = Column(Float)
    age = Column(Integer)
    gender = Column(String)
    activity_level = Column(String)
    sport_type = Column(String)
    bmi = Column(Float)
    recorded_at = Column(DateTime(timezone=True), server_default=func.now())