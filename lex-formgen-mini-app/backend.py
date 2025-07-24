from fastapi import FastAPI
from pydantic import BaseModel
from utils import generate_prompt, call_gemini

app = FastAPI()

class FormInput(BaseModel):
    template: str
    fields: dict

class FormOutput(BaseModel):
    document: str

@app.post("/generate", response_model=FormOutput)
# def generate_doc(payload: FormInput):
#     prompt = generate_prompt(payload.template, payload.fields)
#     result = call_openai(prompt)
#     return {"document": result}
def generate_doc(payload: FormInput):
    """
    Generate a legal document using the selected template and user-provided fields.
    """
    try:
        prompt = generate_prompt(payload.template, payload.fields)
        result = call_gemini(prompt)
        return {"document": result or "⚠️ No content returned from OpenAI."}
    except Exception as e:
        return {"document": f"❌ Error: {str(e)}"}