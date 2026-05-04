from pydantic import BaseModel
from typing import List, Optional

class SymptomRequest(BaseModel):
    symptoms: List[str]
    additional_info: Optional[str] = None

class SymptomResponse(BaseModel):
    analysis: str