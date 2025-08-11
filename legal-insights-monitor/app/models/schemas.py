# app/models/schemas.py
from pydantic import BaseModel
from typing import List, Optional


class InsightRequest(BaseModel):
    companies: List[str]
    keywords: List[str]


class InsightItem(BaseModel):
    summary: str
    topic: str


class InsightResponse(BaseModel):
    insights: List[InsightItem]
