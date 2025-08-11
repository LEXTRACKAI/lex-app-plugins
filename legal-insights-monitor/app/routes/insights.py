# app/routes/insights.py
from fastapi import APIRouter
from app.models.schemas import InsightRequest, InsightResponse
from app.services.scraper import scrape_legal_news
from app.services.summarizer import summarize_text
from app.services.classifier import classify_topic

router = APIRouter()  # <-- THIS LINE is critical!


@router.post("/insights", response_model=InsightResponse)
def generate_insight(data: InsightRequest):
    scraped_data = scrape_legal_news(data.keywords, data.companies)
    summarized = [summarize_text(article) for article in scraped_data]
    classified = [classify_topic(summary) for summary in summarized]

    insights = [{"summary": s, "topic": t} for s, t in zip(summarized, classified)]

    return InsightResponse(insights=insights)
