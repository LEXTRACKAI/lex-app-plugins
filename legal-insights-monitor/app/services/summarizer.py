# app/services/summarizer.py
import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel("gemini-2.5-pro")


# def summarize_text(text: str) -> str:
#     try:
#         prompt = f"Summarize the following legal article in 1-2 sentences:\n\n{text}"
#         response = model.generate_content(prompt)
#         return response.text.strip()
#     except Exception as e:
#         return f"Error summarizing text: {e}"


import time


def summarize_text(text: str) -> str:
    retry_delay = 10  # seconds
    for attempt in range(3):
        try:
            prompt = f"Summarize this legal article:\n\n{text}"
            response = model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            if "429" in str(e):
                print(f"Rate limited. Retrying in {retry_delay} seconds...")
                time.sleep(retry_delay)
                retry_delay *= 2
            else:
                return f"Error summarizing text: {e}"
    return "Error: Exceeded retry limit due to rate limiting."
