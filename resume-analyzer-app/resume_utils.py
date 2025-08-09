import streamlit as st
import anthropic

client = anthropic.Anthropic(
    api_key=st.secrets["ANTHROPIC_API_KEY"]
)

def analyze_resume_with_claude(resume_text, target_role):
    prompt = f"""
You are a resume expert. Given the following resume and target role, provide specific and actionable feedback to help improve the resume for the role.

Resume:
{resume_text}

Target Role:
{target_role}

Feedback:
- Highlight areas of improvement.
- Point out missing skills or experiences.
- Suggest strong bullet points or action verbs.
"""

    response = client.messages.create(
        model="claude-3-opus-20240229", 
        max_tokens=1024,
        temperature=0.7,
        system="You are an expert career coach and resume analyst.",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    return response.content[0].text
