import json
import os
import re
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

models = genai.list_models()
for m in models:
    # Only show those that support generate_content
    if "generateContent" in m.supported_generation_methods:
        print(m.name)

# Load the rule-based condition definitions
with open("symptom_rules.json") as f:
    RULES = json.load(f)

def _generate_ai_recommendations(age, duration, symptoms, conditions):
    """
    Ask Gemini to recommend self-care, next steps, and medications.
    """
    cond_list = ", ".join(c["name"] for c in conditions)
    prompt = f"""
You are an expert medical advisor.
Patient: {age}-year-old, symptoms: {', '.join(symptoms)}, duration: {duration}.
Likely conditions: {cond_list}.

Please output *clearly* three sections, each prefixed with a header:
---
## Self-Care Steps
- (bullet list)
## Next Steps
- (bullet list)
## Medication Suggestions
- (bullet list)
---
"""
    model = genai.GenerativeModel(model_name="gemini-2.5-pro")
    response = model.generate_content(prompt)
    text = response.text.strip()

    # Extract each section by header name using regex
    def extract_section(header):
        pattern = rf"##\s*{header}(.+?)(?=\n##|\Z)"
        match = re.search(pattern, text, flags=re.S | re.I)
        return match.group(1).strip() if match else ""

    self_care = extract_section("Self-Care Steps")
    next_steps = extract_section("Next Steps")
    meds_block = extract_section("Medication Suggestions")

    # Parse bullet list into a Python list
    medications = [
        line.strip().lstrip("-• ")
        for line in meds_block.splitlines()
        if line.strip()
    ]

    return self_care, next_steps, medications

def triage(age, duration, symptoms):
    """
    Combines rule-based condition matching with Gemini AI recommendations.
    """
    # 1. Rule-Based Condition Matching
    matches = []
    for rule in RULES["conditions"]:
        common = set(symptoms) & set(rule["symptoms"])
        if common:
            matches.append({
                "name": rule["name"],
                "confidence": min(100, int(len(common) / len(rule["symptoms"]) * 100))
            })

    if not matches:
        matches = [{"name": "Unknown Condition", "confidence": 50}]

    # 2. Gemini-Powered Recommendations
    self_care, next_steps, medications = _generate_ai_recommendations(
        age, duration, symptoms, matches
    )

    return {
        "conditions": matches,
        "self_care": self_care,
        "next_steps": next_steps,
        "medications": medications
    }
