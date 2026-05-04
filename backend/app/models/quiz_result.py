from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from app.core.database import Base

class QuizResult(Base):
    __tablename__ = "quiz_results"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    quiz_type = Column(String)
    score = Column(Integer)
    total = Column(Integer)
    feedback = Column(Text)
    taken_at = Column(DateTime(timezone=True), server_default=func.now())