from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

# Simple set of words considered offensive (can be expanded)
PROFANE_WORDS = {"badword", "offensive", "curse", "fuck", "fucker", "motherfucker", "shit", "bitch", "bastard", "dick", "asshole", "ass", "slut", "whore", "cunt", "crap", "piss", "damn", "retard", "idiot", "moron", "nigga", "nigger", "bullshit", "douche", "prick", "twat", "cock", "jerk", "hoe", "arse", "bollocks", "bugger"}

class TextInput(BaseModel):
    text: str

def filter_profanity(text: str) -> str:
    words = text.split()
    return " ".join(["****" if word.lower() in PROFANE_WORDS else word for word in words])

@app.post("/filter")
async def filter_text(payload: TextInput):
    cleaned = filter_profanity(payload.text)
    return {"cleaned_text": cleaned}
