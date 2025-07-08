from fastapi import FastAPI, Request
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from transformers import MarianMTModel, MarianTokenizer

app = FastAPI()

# ✅ Serve static files under `/static`
app.mount("/static", StaticFiles(directory="static"), name="static")

# ✅ Serve your frontend index.html at `/`
@app.get("/")
async def root():
    return FileResponse("static/index.html")

# ✅ Your translation model
model_name = 'Helsinki-NLP/opus-mt-en-fr'
tokenizer = MarianTokenizer.from_pretrained(model_name)
model = MarianMTModel.from_pretrained(model_name)

@app.post("/translate")
async def translate_text(request: Request):
    body = await request.json()
    text = body.get("text")
    if not text:
        return {"error": "No text provided."}

    tokens = tokenizer.prepare_seq2seq_batch([text], return_tensors="pt")
    translation = model.generate(**tokens)
    translated_text = tokenizer.batch_decode(translation, skip_special_tokens=True)
    return {"translation": translated_text[0]}
