# test trigger from Sindhura

from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Access environment variables
APP_NAME = os.getenv("APP_NAME", "lextrack-qa-bot")
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
DEBUG_MODE = os.getenv("DEBUG", "False") == "True"
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")

app = FastAPI(title=APP_NAME, debug=DEBUG_MODE)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load chatbot pipeline
chatbot = pipeline("text-generation", model="microsoft/DialoGPT-medium")

class ChatRequest(BaseModel):
    message: str

@app.post("/infer")
def chat(data: ChatRequest):
    result = chatbot(data.message, max_length=100, pad_token_id=50256)
    return {"response": result[0]["generated_text"]}

