import streamlit as st
import requests

st.set_page_config(page_title="Profanity Filter", layout="centered")
st.title("🧹 Profanity Filter App")
st.write("Enter some text and the app will return a censored version by filtering out inappropriate words.")

user_input = st.text_area("Enter your text here:", height=150)

if st.button("Censor Text"):
    if not user_input.strip():
        st.warning("Please enter some text.")
    else:
        try:
            response = requests.post("http://localhost:8000/filter", json={"text": user_input})
            if response.status_code == 200:
                result = response.json()
                censored = result.get("cleaned_text", "N/A")
                st.success(f"Censored Output: {censored}")
            else:
                st.error("Error from FastAPI server.")
        except Exception as e:
            st.error(f"Could not connect to FastAPI server: {e}")