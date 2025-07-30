from fastapi import FastAPI
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline

app = FastAPI()

# Load grammar correction model and tokenizer
tokenizer = AutoTokenizer.from_pretrained("prithivida/grammar_error_correcter_v1")
model = AutoModelForSeq2SeqLM.from_pretrained("prithivida/grammar_error_correcter_v1")
corrector = pipeline("text2text-generation", model=model, tokenizer=tokenizer)

class TextInput(BaseModel):
    text: str

@app.post("/fix-grammar")
async def fix_grammar(input_text: TextInput):
    corrected = corrector(input_text.text, max_length=128)[0]["generated_text"]
    return {"corrected_text": corrected}
