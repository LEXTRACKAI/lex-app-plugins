
import streamlit as st
import requests

st.set_page_config(page_title="Grammar Fixer", layout="centered")

st.title("📝 Grammar Fixer Mini App")
st.write("Correct grammatical mistakes in your sentence using AI.")

# User input
user_text = st.text_area("Enter your sentence:", height=150)

# API endpoint
API_URL = "http://localhost:8000/fix-grammar"  # change if hosted elsewhere

if st.button("Fix Grammar"):
    if user_text.strip() == "":
        st.warning("Please enter some text.")
    else:
        with st.spinner("Fixing grammar..."):
            try:
                response = requests.post(API_URL, json={"text": user_text})
                if response.status_code == 200:
                    fixed = response.json()["corrected_text"]
                    st.success("Grammar fixed!")
                    st.text_area("Corrected Sentence:", fixed, height=150)
                else:
                    st.error("Error: " + str(response.text))
            except Exception as e:
                st.error(f"Connection failed: {e}")
