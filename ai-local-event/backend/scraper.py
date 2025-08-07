import requests

API_TOKEN = "P27X4ID2GFCSLPFYIBF7"
SEARCH_CITY = "new york"

def fetch_events(city):
    print(f"Fetching events for: {city}")
    
    url = "https://www.eventbriteapi.com/v3/events/search/"
    headers = {
        "Authorization": f"Bearer {API_TOKEN}",
    }
    params = {
        "location.address": city,
        "expand": "venue",
        "sort_by": "date"
    }

    response = requests.get(url, headers=headers, params=params)
    
    if response.status_code != 200:
        print("Failed to fetch events:", response.status_code, response.text)
        return []
    
    data = response.json()
    events = data.get("events", [])

    simplified_events = []
    for event in events:
        simplified_events.append({
            "title": event["name"]["text"],
            "description": event["description"]["text"] if event["description"] else "",
            "date": event["start"]["local"],
            "location": event.get("venue", {}).get("address", {}).get("localized_address_display", city),
            "link": event["url"]
        })

    return simplified_events
