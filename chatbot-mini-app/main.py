from fastapi import FastAPI, Request
from pydantic import BaseModel
from dotenv import load_dotenv
import os

load_dotenv()  # Load variables from .env

app = FastAPI()

class UserInput(BaseModel):
    message: str

@app.post("/generate")
async def generate_response(input: UserInput):
    user_message = input.message.lower()

    # Optional: Use an env variable as part of the logic
    app_name = os.getenv("APP_NAME", "Chatbot")

    if "hello" in user_message:
        return {"response": f"Hi there! Welcome to {app_name}."}
    elif "bye" in user_message:
        return {"response": "Goodbye! Have a great day!"}
    else:
        return {"response": "I'm a simple chatbot. Ask me anything!"}

