from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from utils import triage

app = FastAPI()

class TriageInput(BaseModel):
    age: int
    duration: str
    symptoms: list[str]

class TriageOutput(BaseModel):
    conditions: list[dict]
    self_care: str
    next_steps: str
    medications: list[str]

@app.post("/triage", response_model=TriageOutput)
def triage_endpoint(payload: TriageInput):
    try:
        return triage(payload.age, payload.duration, payload.symptoms)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))