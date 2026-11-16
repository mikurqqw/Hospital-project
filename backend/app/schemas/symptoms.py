from typing import Annotated

from pydantic import BaseModel, Field


class SymptomRequest(BaseModel):
    symptoms: list[Annotated[str, Field(min_length=1, max_length=200)]] = Field(
        min_length=1, max_length=30
    )
    additional_info: str | None = Field(default=None, max_length=2000)


class SymptomResponse(BaseModel):
    analysis: str
