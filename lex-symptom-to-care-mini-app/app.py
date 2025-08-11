import streamlit as st
import requests

st.title("🩺 Symptom to Care – AI Health Triage Assistant")

age = st.number_input("Age", min_value=0, max_value=120, value=30)
duration = st.text_input("Symptom Duration", "1 day")
symptoms = st.text_area("Symptoms (comma-separated)", "cough, fever")

if st.button("Get Recommendation"):
    payload = {
        "age": age,
        "duration": duration,
        "symptoms": [s.strip() for s in symptoms.split(",")]
    }
    res = requests.post("http://localhost:8000/triage", json=payload)
    if res.ok:
        data = res.json()
        st.subheader("Likely Conditions")
        for c in data["conditions"]:
            st.write(f"- **{c['name']}** ({c['confidence']}%)")
        st.subheader("Self-Care Steps")
        st.write(data["self_care"])
        st.subheader("Next Steps")
        st.write(data["next_steps"])
        st.subheader("Pharmacy Suggestions")
        for m in data["medications"]:
            st.write(f"- {m}")
    else:
        st.error(f"Error {res.status_code}: {res.text}")