# app/main.py
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from app.routes import insights
import os

app = FastAPI()

# === Mount static/ folder ===
static_dir = os.path.join(os.path.dirname(__file__), "..", "static")
app.mount("/static", StaticFiles(directory=static_dir), name="static")

# === Include router ===
app.include_router(insights.router, prefix="/api", tags=["Insights"])


# === Optional root endpoint ===
@app.get("/", response_class=HTMLResponse)
def serve_ui():
    index_path = os.path.join(static_dir, "index.html")
    with open(index_path, "r") as f:
        return f.read()
