from playwright.sync_api import sync_playwright
from supabase_client import supabase



from datetime import datetime

def store_events_in_supabase(events):
    for event in events:
        try:
            # Avoid duplicates
            existing = supabase.table("events").select("link").eq("link", event["link"]).execute()
            if existing.data:
                print(f"Already exists: {event['title']}")
                continue

            # Prepare event with required fields
            db_event = {
                "title": event["title"],
                "summary": event.get("summary", "No summary available"),
                "link": event["link"],
                "location": event.get("location", "Unknown"),
                "event_date": event.get("event_date", datetime.utcnow().isoformat()),
                "category": event.get("category", "General"),
                "tags": event.get("tags", ["free"])
            }

            supabase.table("events").insert(db_event).execute()
            print(f"Inserted: {event['title']}")

        except Exception as e:
            print("Error inserting:", e)


def scrape_free_events(city="new-york"):
    events = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        url = f"https://www.eventbrite.com/d/ny--{city}/all-events/?page=1"
        page.goto(url, timeout=60000)

        page.wait_for_timeout(5000)  # Let the page load

        cards = page.query_selector_all("a.event-card-link")

        for card in cards:
            try:
                text = card.inner_text().lower()

                if "free" not in text:
                    continue  # Skip non-free events

                title = card.get_attribute("aria-label") or "No title"
                link = card.get_attribute("href") or "No link"
                location = card.get_attribute("data-event-location") or "Unknown"

                events.append({
                    "title": title,
                    "link": link,
                    "location": location,
                    "price": "free"
                })
            except Exception as e:
                print("Error parsing card:", e)

        browser.close()
    return events

# Test run
if __name__ == "__main__":
    print("Scraping free events...")
    results = scrape_free_events("new-york")
    print(f"Found {len(results)} free events:")
    for e in results:
        print(f"{e['title']} - {e['link']} - {e['location']}")


    events = scrape_free_events("new-york")
    print(f"Found {len(events)} free events.")
    store_events_in_supabase(events)
