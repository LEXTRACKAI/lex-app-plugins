# app.py
import streamlit as st
import openai
from resume_utils import analyze_resume

openai.api_key = st.secrets["OPENAI_API_KEY"]

def run_app():
    st.set_page_config(page_title="AI Resume Analyzer", page_icon="📄")

    st.title("📄 AI Resume Analyzer")
    st.markdown("Paste your resume text and enter your target role. GPT will evaluate and give feedback!")

    resume_text = st.text_area("📋 Paste your resume text here", height=300)
    target_role = st.text_input("🎯 Target Role (e.g., 'Data Science Intern at Meta')")

    if st.button("Analyze Resume"):
        if resume_text and target_role:
            with st.spinner("Analyzing your resume..."):
                feedback = analyze_resume(resume_text, target_role)
                st.subheader("🔍 AI Feedback")
                st.markdown(feedback)
        else:
            st.warning("Please paste your resume and specify a target role.")
