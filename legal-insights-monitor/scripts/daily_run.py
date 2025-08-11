# scripts/daily_run.py
from app.services.scraper import scrape_legal_news
from app.services.summarizer import summarize_text
from app.services.classifier import classify_topic
from app.utils.logger import get_logger
import datetime
import os

OUTPUT_DIR = "app/data/processed"
logger = get_logger("daily-run")

# Example keywords and companies (can be parameterized)
KEYWORDS = ["data privacy", "antitrust", "regulation"]
COMPANIES = ["Meta", "Amazon", "Apple"]


def run():
    logger.info("Starting daily legal insight collection...")

    scraped = scrape_legal_news(KEYWORDS, COMPANIES)
    logger.info(f"Found {len(scraped)} relevant articles.")

    output_data = []
    for article in scraped:
        summary = summarize_text(article)
        topic = classify_topic(summary)
        output_data.append((summary, topic))

    # Save to file
    today = datetime.date.today().isoformat()
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    filepath = os.path.join(OUTPUT_DIR, f"insights_{today}.txt")

    with open(filepath, "w") as f:
        for summary, topic in output_data:
            f.write(f"[{topic}] {summary}\n\n")

    logger.info(f"Saved {len(output_data)} insights to {filepath}")


if __name__ == "__main__":
    run()
