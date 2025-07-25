import streamlit as st
import requests

st.title("📝 Lex FormGen – AI Legal Form Generator")

template = st.selectbox("Select a legal form", ["NDA", "Lease Agreement"])
name = st.text_input("Your Name")
counterparty = st.text_input("Counterparty Name")
duration = st.text_input("Duration (e.g., 3 months)")
jurisdiction = st.text_input("Jurisdiction (e.g., New York)")

if st.button("Generate Document"):
    payload = {
        "template": template,
        "fields": {
            "name": name,
            "counterparty": counterparty,
            "duration": duration,
            "jurisdiction": jurisdiction
        }
    }
    response = requests.post("http://localhost:8000/generate", json=payload)
    # 💡 Add this before calling .json():
    print("Raw response:", response.text)
    print("Status code:", response.status_code)
    st.markdown(response.json()["document"])