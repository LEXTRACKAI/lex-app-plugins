import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-pro")


def explain_clause(clause: str) -> str:
    prompt = f"Explain this legal clause in simple terms:\n\n{clause}"
    response = model.generate_content(prompt)
    return response.text
