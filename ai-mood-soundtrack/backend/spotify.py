import os
import httpx
from dotenv import load_dotenv
import random

import requests   
load_dotenv()

SPOTIFY_CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
SPOTIFY_CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")
TOKEN_URL = "https://accounts.spotify.com/api/token"

# Hardcoded valid Spotify genres (as of known update)
VALID_GENRES = ["pop", "edm", "dance", "house", "techno"]

# Map mood to features and genre choices
MOOD_MAP = {
    "happy": {
        "features": {"min_valence": 0.7, "min_energy": 0.6},
        "genres": ["pop", "edm", "dance", "funk"]
    },
    "content": {
        "features": {"min_valence": 0.5, "max_energy": 0.5},
        "genres": ["jazz", "acoustic", "soul", "r-n-b"]
    },
    "neutral": {
        "features": {"min_valence": 0.4, "max_valence": 0.6},
        "genres": ["indie", "folk", "ambient"]
    },
    "sad": {
        "features": {"max_valence": 0.3, "max_energy": 0.4},
        "genres": ["blues", "classical", "emo", "piano"]
    },
    "depressed": {
        "features": {"max_valence": 0.2, "max_energy": 0.3},
        "genres": ["ambient", "acoustic", "grunge", "opera"]
    }
}



def get_song_suggestions_from_ai(mood: str) -> list[dict]:
    prompt = f"Suggest 5 popular songs that match the mood '{mood}'. Format: Song - Artist"

    response = requests.post(
        "http://localhost:11434/api/generate",
        json={"model": "llama3", "prompt": prompt, "stream": False}
    )

    content = response.json()["response"]

    suggestions = []
    for line in content.strip().split("\n"):
        if " - " in line:
            title, artist = line.split(" - ", 1)
            suggestions.append({"title": title.strip(), "artist": artist.strip()})
    return suggestions

def get_spotify_access_token():
    response = httpx.post(
        TOKEN_URL,
        data={"grant_type": "client_credentials"},
        auth=(SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET)
    )
    response.raise_for_status()
    return response.json()["access_token"]

def get_tracks_by_mood(mood: str):
    token = get_spotify_access_token()
    headers = {
        "Authorization": f"Bearer {token}"
    }

    suggestions = get_song_suggestions_from_ai(mood)
    results = []

    for s in suggestions:
        query = f"{s['title']} {s['artist']}"
        url = f"https://api.spotify.com/v1/search?q={query}&type=track&limit=1"
        res = httpx.get(url, headers=headers)
        if res.status_code == 200:
            data = res.json()
            items = data.get("tracks", {}).get("items", [])
            if items:
                track = items[0]
                results.append({
                    "name": track["name"],
                    "artist": track["artists"][0]["name"],
                    "url": track["external_urls"]["spotify"],
                    "uri": track["uri"]
                })
    return results

