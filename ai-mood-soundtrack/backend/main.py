from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os

from mood import detect_mood
from spotify import get_tracks_by_mood

load_dotenv()  # Load .env variables

app = FastAPI()

# Allow frontend to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # replace with frontend URL in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request model
class MoodRequest(BaseModel):
    text: str

@app.get("/")
def root():
    return {"message": "Mood Soundtrack Agent is running!"}

@app.post("/detect-mood")
def detect_user_mood(payload: MoodRequest):
    mood = detect_mood(payload.text)
    return {"mood": mood}

@app.get("/recommend-tracks")
def recommend_tracks(mood: str = Query(...)):
    tracks = get_tracks_by_mood(mood)
    return {"tracks": tracks}
