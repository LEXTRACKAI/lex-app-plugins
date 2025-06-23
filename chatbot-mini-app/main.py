#test trigger for Sindhura.  
from fastapi import FastAPI, Request
from pydantic import BaseModel

app = FastAPI()

class UserInput(BaseModel):
    message: str

@app.post("/generate")
async def generate_response(input: UserInput):
    user_message = input.message.lower()

    # Basic rule-based chatbot
    if "hello" in user_message:
        return {"response": "Hi there! How can I help you today?"}
    elif "bye" in user_message:
        return {"response": "Goodbye! Have a great day!"}
    else:
        return {"response": "I'm a simple chatbot. Ask me anything!"}
