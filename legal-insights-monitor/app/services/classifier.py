# app/services/classifier.py
import google.generativeai as genai

# Assumes genai.configure() has already been done in summarizer
model = genai.GenerativeModel("gemini-2.5-pro")


def classify_topic(summary: str) -> str:
    try:
        prompt = (
            f"Classify the following legal summary into a topic like "
            f"'Antitrust Law', 'Privacy Law', 'Employment Law', 'Corporate Law', etc.:\n\n"
            f"Summary: {summary}"
        )
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        return f"Unknown ({e})"
