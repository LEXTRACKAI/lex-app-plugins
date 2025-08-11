import streamlit as st
from resume_utils import analyze_resume_with_claude


def run_app():
    st.set_page_config(page_title="AI Resume Feedback App", layout="wide")
    st.title("AI Resume Feedback App")

    # Tabs
    tab1, tab2 = st.tabs(["🤖 Resume Feedback", "📊 Dashboard"])

    # -------- TAB 1: Resume Analyzer ----------
    with tab1:
        st.header("🎯 Upload Resume and Add Target Role")

        uploaded_file = st.file_uploader("📄 Upload your resume (PDF or TXT)", type=["pdf", "txt"])
        target_role = st.text_input("🎯 Target Role (e.g., 'Data Science Intern at Meta')")

        if st.button("Analyze Resume"):
            if uploaded_file and target_role:
                resume_text = uploaded_file.read().decode("utf-8", errors="ignore")
                with st.spinner("Analyzing your resume with Claude..."):
                    feedback = analyze_resume_with_claude(resume_text, target_role)
                    st.subheader("✅ AI Feedback")
                    st.write(feedback)
            else:
                st.warning("⚠️ Please upload a resume and enter a target role.")

    # -------- TAB 2: Dashboard ----------
    with tab2:
        st.header("📊 AI Feedback Dashboard")

        # Dummy scorecards (replace with real metrics if you track them)
        col1, col2, col3 = st.columns(3)
        col1.metric("💯 Feedback Accuracy", "92%", "+2%")
        col2.metric("🧠 Clarity Score", "85%", "+5%")
        col3.metric("🤖 Model Confidence", "78%", "-1%")

        st.subheader("📈 Sentiment Breakdown")
        sentiment_counts = {"Positive": 12, "Neutral": 5, "Negative": 3}
        st.bar_chart(sentiment_counts)

        st.subheader("🌟 Rate the AI Feedback")
        user_rating = st.slider("Rate from 1 (bad) to 5 (great)", 1, 5, 4)
        st.write(f"⭐ You rated the feedback: {user_rating} stars")

if __name__ == "__main__":
    run_app()
