# from fastapi import FastAPI, Request
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.staticfiles import StaticFiles
# import os
# import requests
# from dotenv import load_dotenv
# load_dotenv()

# app = FastAPI()

# # Allow requests from your frontend (update origin in production)
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_methods=["POST"],
#     allow_headers=["*"],
# )

# GROQ_API_KEY = os.getenv("GROQ_API_KEY")
# GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
# MODEL = "llama3-70b-8192"  

# @app.post("/api/decision")
# async def analyze_decision(request: Request):
#     data = await request.json()
#     decision = data.get("decision", "")
#     pros = data.get("pros", [])
#     cons = data.get("cons", [])

#     prompt = f"""Please analyze this decision: "{decision}"

# POSITIVE FACTORS:
# {chr(10).join([f"• {p}" for p in pros])}

# CONCERNS/NEGATIVES:
# {chr(10).join([f"• {c}" for c in cons])}

# Please provide:
# 1. A clear recommendation (PROCEED, DO NOT PROCEED, or NEUTRAL)
# 2. Confidence percentage (0–100%)
# 3. Detailed reasoning for your recommendation
# 4. Key factors that influenced your analysis
# 5. Any additional considerations or suggestions"""

#     payload = {
#         "model": MODEL,
#         "messages": [
#             {"role": "system", "content": "You are an expert decision analyst who gives clear, human advice."},
#             {"role": "user", "content": prompt}
#         ],
#         "temperature": 0.4,
#         "max_tokens": 1024
#     }

#     headers = {
#         "Authorization": f"Bearer {GROQ_API_KEY}",
#         "Content-Type": "application/json"
#     }

#     response = requests.post(GROQ_API_URL, json=payload, headers=headers)
#     return response.json()

# app.mount("/", StaticFiles(directory=".", html=True), name="static")


from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import requests
import re

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model config
MODEL = os.getenv("MODEL", "llama3-70b-8192")
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")

class DecisionInput(BaseModel):
    decision: str
    pros: list[str]
    cons: list[str]

@app.post("/analyze")  # Changed to match frontend
async def analyze_decision(data: DecisionInput):
    prompt = generate_prompt(data.decision, data.pros, data.cons)
    
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    
    body = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": "You are a helpful decision-making assistant."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.4,
        "max_tokens": 1024
    }
    
    try:
        response = requests.post(GROQ_API_URL, headers=headers, json=body)
        response.raise_for_status()
        result = response.json()
        
        if 'choices' not in result or len(result['choices']) == 0:
            raise ValueError("Invalid response from Groq API")
        
        text = result['choices'][0]['message']['content']
        
        # Parse the structured response
        parsed_response = parse_ai_response(text)
        
        # Return in the format expected by frontend
        return {
            "basic_output": {
                "recommendation": parsed_response["recommendation"],
                "confidence_percentage": parsed_response["confidence_percentage"],
                "reasoning": parsed_response["reasoning"],
                "key_factors": parsed_response["key_factors"],
                "suggestions": parsed_response["suggestions"]
            }
        }
        
    except Exception as e:
        print(f"Error calling Groq API: {str(e)}")
        # Return a default response on error
        return {
            "basic_output": {
                "recommendation": "WAIT",
                "confidence_percentage": 0,
                "reasoning": f"Error analyzing decision: {str(e)}",
                "key_factors": [],
                "suggestions": []
            }
        }

def generate_prompt(decision, pros, cons):
    pros_text = "\n".join(f"- {p}" for p in pros)
    cons_text = "\n".join(f"- {c}" for c in cons)
    
    return f"""Help me make a decision using the pros and cons list.

Decision: {decision}

Pros:
{pros_text}

Cons:
{cons_text}

Please respond in EXACTLY this format:
Recommendation: [PROCEED / WAIT / AVOID]
Confidence percentage: [X]%
Detailed Reasoning: [Your detailed analysis here]
Key factors: [List 3-5 key factors, separated by semicolons]
Additional suggestions: [List any suggestions, separated by semicolons]
"""

def parse_ai_response(text):
    """Parse the AI response into structured data"""
    
    # Extract recommendation
    rec_match = re.search(r"Recommendation:\s*(PROCEED|WAIT|AVOID)", text, re.IGNORECASE)
    recommendation = rec_match.group(1).upper() if rec_match else "WAIT"
    
    # Extract confidence
    conf_match = re.search(r"Confidence percentage:\s*(\d+)%", text, re.IGNORECASE)
    confidence = int(conf_match.group(1)) if conf_match else 50
    
    # Extract reasoning
    reasoning_match = re.search(r"Detailed Reasoning:\s*(.+?)(?=Key factors:|$)", text, re.IGNORECASE | re.DOTALL)
    reasoning = reasoning_match.group(1).strip() if reasoning_match else text
    
    # Extract key factors
    factors_match = re.search(r"Key factors:\s*(.+?)(?=Additional suggestions:|$)", text, re.IGNORECASE | re.DOTALL)
    if factors_match:
        factors_text = factors_match.group(1).strip()
        key_factors = [f.strip() for f in factors_text.split(';') if f.strip()]
    else:
        key_factors = []
    
    # Extract suggestions
    suggestions_match = re.search(r"Additional suggestions:\s*(.+?)$", text, re.IGNORECASE | re.DOTALL)
    if suggestions_match:
        suggestions_text = suggestions_match.group(1).strip()
        suggestions = [s.strip() for s in suggestions_text.split(';') if s.strip()]
    else:
        suggestions = []
    
    return {
        "recommendation": recommendation,
        "confidence_percentage": confidence,
        "reasoning": reasoning,
        "key_factors": key_factors[:5],  # Limit to 5 factors
        "suggestions": suggestions[:5]   # Limit to 5 suggestions
    }

# Optional: Add a test endpoint
@app.get("/")
async def root():
    return {"message": "Decision Maker API is running"}