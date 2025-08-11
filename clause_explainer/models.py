from pydantic import BaseModel


class ClauseRequest(BaseModel):
    clause: str


class ClauseResponse(BaseModel):
    explanation: str
