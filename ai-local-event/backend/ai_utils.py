import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()


genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def get_event_tags(title: str, description: str):
    prompt = f"""You're an AI that assigns 3–5 relevant tags to help categorize local events.

    Title: {title}
    Description: {description}

    Return only a comma-separated list of tags (e.g., Music, Outdoors, Food, Networking)."""

    model = genai.GenerativeModel("gemini-2.0-flash")  # ✅ Newer model

    response = model.generate_content(prompt)
    print("Using API key starts with:", os.getenv("GEMINI_API_KEY")[:8])
    print("Prompt:", prompt)

    return [tag.strip() for tag in response.text.split(",") if tag.strip()]

def get_event_summary(title: str, description: str) -> str:
    prompt = f"""Summarize this event in 1–2 short lines:

    Title: {title}
    Description: {description}
    """
    # model = genai.GenerativeModel("models/gemini-1.5-pro-latest") 
    #  # or "gemini-1.5-flash"
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(prompt)
    return response.text.strip()


# def scrape_sample_events():
#     return [
#         {
#             "title": "Live Jazz Night at Central Park",
#             "description": "An evening of soothing jazz music under the stars.",
#             "location": "New York",
#             "event_date": "2025-08-01"
#         },
#         {
#             "title": "Startup Pitch Fest 2025",
#             "description": "Pitch your ideas to top VCs in NYC.",
#             "location": "New York",
#             "event_date": "2025-08-03"
#         }
#     ]

