from textblob import TextBlob

def detect_mood(text: str) -> str:
    """Detect mood from user input using sentiment polarity."""
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity

    if polarity > 0.5:
        return "happy"
    elif polarity > 0.1:
        return "content"
    elif polarity > -0.1:
        return "neutral"
    elif polarity > -0.5:
        return "sad"
    else:
        return "depressed"
