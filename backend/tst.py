import base64
import httpx
import os
from dotenv import load_dotenv

# Load .env credentials
load_dotenv()

def get_access_token():
    client_id = os.getenv("SPOTIFY_CLIENT_ID")
    client_secret = os.getenv("SPOTIFY_CLIENT_SECRET")

    if not client_id or not client_secret:
        raise Exception("Missing Spotify credentials")

    auth_str = f"{client_id}:{client_secret}"
    b64_auth_str = base64.b64encode(auth_str.encode()).decode()

    headers = {
        "Authorization": f"Basic {b64_auth_str}",
        "Content-Type": "application/x-www-form-urlencoded"
    }

    data = {
        "grant_type": "client_credentials"
    }

    response = httpx.post("https://accounts.spotify.com/api/token", headers=headers, data=data)

    if response.status_code == 200:
        return response.json()["access_token"]
    else:
        print(response.status_code, response.text)
        raise Exception("Failed to get access token from Spotify")

# Test the function
def main():
    try:
        token = get_access_token()
        print("✅ Access Token retrieved successfully:\n")
        print(token)
    except Exception as e:
        print("❌ Error:", e)

if __name__ == "__main__":
    main()
