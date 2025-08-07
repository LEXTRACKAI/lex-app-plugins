from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import os, time, sys
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime

from supabase_client import supabase
from ai_utils import get_event_tags, get_event_summary
from email_utils import send_email  # If you're using a separate utility for email

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
# from scrapers.eventbrite_scraper import scrape_events as scrape_eventbrite


# --------------------------- CONFIG ---------------------------
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CityInput(BaseModel):
    city: str = "New York"


# --------------------------- ROUTES ---------------------------
@app.get("/")
async def root():
    return {"message": "Local Events Agent backend is running"}

@app.post("/subscribe")
async def subscribe(request: Request):
    body = await request.json()
    data = {
        "location": body.get("location"),
        "interests": ",".join(body.get("interests", [])),
        "email": body.get("email"),
    }

    try:
        result = supabase.table("subscriptions").insert(data).execute()
        return {"status": "saved", "data": result.data}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@app.post("/scrape-and-add-events")
async def scrape_and_add_events():
    try:
        events = scrape_eventbrite()
        inserted = []

        for ev in events:
            raw_cat    = ev.get("category")
            categories = [raw_cat] if raw_cat else None
            raw_dt     = ev.get("event_date")
            date_iso   = raw_dt.split("T")[0] if raw_dt else None

            try:
                tags = get_event_tags(ev["title"], ev["description"])
                summary = get_event_summary(ev["title"], ev["description"])
                time.sleep(4)
            except Exception as ai_err:
                print("Gemini error:", ai_err)
                tags = []
                summary = None

            data = {
                "title":       ev.get("title"),
                "description": ev.get("description"),
                "location":    ev.get("location"),
                "categories":  categories,
                "date":        date_iso,
                "event_date":  raw_dt,
                "tags":        tags,
                "summary":     summary,
            }

            supabase.table("events").insert(data).execute()
            inserted.append(data)

        return {"inserted": inserted}

    except Exception as e:
        import traceback; traceback.print_exc()
        return JSONResponse(status_code=500, content={"error": str(e)})


@app.post("/match-events")
async def match_events(request: Request):
    body = await request.json()
    email = body.get("email")

    user = supabase.table("subscriptions").select("*").eq("email", email).single().execute().data
    if not user:
        return JSONResponse(status_code=404, content={"error": "User not found"})

    location = user["location"]
    interests = [i.strip() for i in user["interests"].split(",") if i.strip()]
    events = supabase.table("events").select("*").eq("location", location).execute().data

    matched = []
    for event in events:
        tags = event.get("tags") or []
        if isinstance(tags, str):
            tags = [t.strip() for t in tags.split(",")]
        if any(interest.lower() in [t.lower() for t in tags] for interest in interests):
            matched.append(event)

    return {"matched_events": matched}


@app.post("/send-alert")
async def send_alert(request: Request):
    body = await request.json()
    recipient_email = body.get("email")
    matched_events = body.get("events", [])

    if not recipient_email or not matched_events:
        return JSONResponse(status_code=400, content={"error": "Missing email or events"})

    subject = "🎉 Your Local Event Matches!"
    html_content = "<h3>We found some events for you:</h3><ul>"
    for e in matched_events:
        html_content += f"<li><b>{e['title']}</b> - {e['description']}</li>"
    html_content += "</ul>"

    try:
        msg = MIMEMultipart()
        msg["From"] = os.getenv("EMAIL_SENDER")
        msg["To"] = recipient_email
        msg["Subject"] = subject
        msg.attach(MIMEText(html_content, "html"))

        with smtplib.SMTP(os.getenv("SMTP_HOST"), int(os.getenv("SMTP_PORT"))) as server:
            server.starttls()
            server.login(os.getenv("SMTP_USER"), os.getenv("SMTP_PASS"))
            server.sendmail(msg["From"], msg["To"], msg.as_string())

        return {"status": "email sent"}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
