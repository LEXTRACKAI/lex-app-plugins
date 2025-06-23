#test trigger from Sindhura 
from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

chatbot = pipeline("text-generation", model="microsoft/DialoGPT-medium")

class ChatRequest(BaseModel):
    message: str

@app.post("/infer")
def chat(data: ChatRequest):
    result = chatbot(data.message, max_length=100, pad_token_id=50256)
    return {"response": result[0]["generated_text"]}
