import google.generativeai as genai

genai.configure(api_key="AIzaSyA9TywTucTuH0W3iTXABOGjwOox-chb9F8")

models = genai.list_models()

for model in models:
    print(f"🧠 Model name: {model.name}")
    print(f"   Description: {model}")
    print("-" * 40)
