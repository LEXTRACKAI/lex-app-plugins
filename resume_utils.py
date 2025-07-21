import openai
import streamlit as st

openai.api_key = st.secrets["OPENAI_API_KEY"]

def analyze_resume(resume_text, target_role):
    prompt = f"""You are a hiring manager..."""

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7
        )
        return response.choices[0].message.content

    except Exception as e:
        return f"❌ Error from OpenAI API: {e}"