from openai import OpenAI
import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()
# print("API Key loaded:", os.getenv("OPENAI_API_KEY"))

# client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
models = genai.list_models()
for m in models:
    print(m.name, m.supported_generation_methods)

def generate_prompt(template_name, fields):
    with open(f"form_templates/{template_name.lower().replace(' ', '_')}.txt") as f:
        base = f.read()
    return base.format(**fields)

def call_gemini(prompt):
    model = genai.GenerativeModel(model_name="gemini-2.5-pro")
    response = model.generate_content(prompt)
    return response.text

# def call_openai(prompt):
#     response = client.chat.completions.create(
#         model="gpt-3.5-turbo",
#         messages=[
#             {"role": "user", "content": prompt}
#         ],
#         temperature=0.4
#     )
#     return response.choices[0].message.content

# def call_openai(prompt):
#     return "🔧 Mocked response: Here is your generated legal document based on the prompt."
