import streamlit as st
import requests

# Inject custom CSS for beautiful UI
st.markdown("""
    <style>
    .main {
        background-color: #f7f9fc;
        padding: 2rem;
        font-family: 'Segoe UI', sans-serif;
    }

    h1 {
        color: #0056d2;
        text-align: center;
        margin-bottom: 1.5rem;
    }

    .stTextInput > div > div > input {
        padding: 12px;
        border: 2px solid #0056d2;
        border-radius: 10px;
        width: 100%;
        font-size: 16px;
    }

    button[kind="primary"] {
        background-color: #0056d2;
        color: white;
        font-weight: bold;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        border: none;
        margin-top: 1rem;
        transition: background-color 0.3s ease;
    }

    button[kind="primary"]:hover {
        background-color: #003b9a;
    }

    .stCheckbox > label {
        font-size: 16px;
    }

    .response-box {
        margin-top: 2rem;
        padding: 1.5rem;
        background-color: #ffffff;
        border-left: 5px solid #0056d2;
        border-radius: 8px;
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.05);
        font-size: 17px;
    }

    footer {
        text-align: center;
        margin-top: 3rem;
        font-size: 15px;
        color: #666;
    }

    footer span {
        color: #e25555;
        font-size: 18px;
    }
    </style>
""", unsafe_allow_html=True)

# App Title
st.markdown("<h1>🤖 LEX AI Assistant</h1>", unsafe_allow_html=True)

# User Input
query = st.text_input("Ask something:")

# Optional: Web Search Checkbox
use_search = st.checkbox("Enable Web Search")

# Submit Button
if st.button("Get Answer"):
    if query.strip() == "":
        st.warning("Please enter a question.")
    else:
        try:
            response = requests.post(
    "http://127.0.0.1:9999/chat",
    json={
        "model_name": "llama3-70b-8192",
        "model_provider": "Groq",
        "system_prompt": "You are a helpful AI assistant.",
        "messages": [
            {"role": "user", "content": query}
        ],
        "allow_search": use_search
    }
)

            data = response.json()
            if "response" in data:
                st.markdown(f"<div class='response-box'>{data['response']}</div>", unsafe_allow_html=True)
            else:
                st.error(data.get("error", "Something went wrong."))

        except Exception as e:
            st.error(f"❌ Failed to connect to backend: {e}")

# Footer
st.markdown("<footer>Made with <span>❤️</span> by Maliha</footer>", unsafe_allow_html=True)
