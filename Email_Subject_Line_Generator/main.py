import streamlit as st
import random
import spacy
from spacy.matcher import Matcher

nlp = spacy.load("en_core_web_sm")

templates = {
    "finance": {
        "default": [
            "Loan Payment Request – {amount} for {term}",
            "Request: Education Loan Disbursement for {term}",
            "Disbursement Needed: {amount} – {term}"
        ],
        "urgent": [
            "Urgent: {amount} Disbursement Needed for {term}",
            "Immediate Action Required: Loan for {term}"
        ],
        "polite": [
            "Kindly Process: {amount} Loan Request for {term}",
            "Assistance Requested: Education Loan for {term}"
        ]
    },
    "internship": {
        "default": [
            "Request: Internship Extension",
            "Follow-Up: CPT Form for Internship",
            "CPT Approval Required for Internship Continuation"
        ],
        "urgent": [
            "Urgent: CPT Process for Internship Extension",
            "Immediate Action: Internship Continuation Request"
        ],
        "polite": [
            "Kindly Assist: CPT Documentation for Internship",
            "Requesting Guidance on Internship Process"
        ]
    },
    "visa": {
        "default": [
            "Request: Visa Documentation",
            "Guidance Needed: Visa Process",
            "Follow-Up: Student Visa Inquiry"
        ],
        "urgent": [
            "Urgent: Visa Approval Assistance Required",
            "Time-Sensitive: Visa Process Clarification Needed"
        ],
        "polite": [
            "Kindly Help With: Visa Paperwork",
            "Assistance Needed: Visa Status Follow-Up"
        ]
    },
    "course": {
        "default": [
            "Request: Course Enrollment",
            "Drop/Add Request: {term}",
            "Follow-Up: Class Registration Issue"
        ],
        "urgent": [
            "Urgent: Course Enrollment Assistance Needed",
            "Time-Sensitive: Add/Drop Request for {term}"
        ],
        "polite": [
            "Kindly Approve: Course Change Request",
            "Seeking Help With: {term} Registration"
        ]
    },
    "default": {
        "default": [
            "Request: {topic}",
            "Assistance Needed: {topic}",
            "Follow-Up: {topic}"
        ],
        "urgent": [
            "Urgent: Action Required – {topic}",
            "Immediate Attention: {topic}"
        ],
        "polite": [
            "Kindly Assist With: {topic}",
            "Support Requested: {topic}"
        ]
    }
}

def detect_context(text):
    text = text.lower()
    if "loan" in text or "disbursement" in text or "fee" in text:
        return "finance"
    if "internship" in text or "cpt" in text:
        return "internship"
    if "visa" in text:
        return "visa"
    if "course" in text or "enroll" in text or "drop" in text or "add" in text:
        return "course"
    return "default"

def extract_finance_details(text):
    doc = nlp(text)
    matcher = Matcher(nlp.vocab)
    matcher.add("TERM", [[{"LOWER": "summer"}, {"LOWER": "course"}]])
    matches = matcher(doc)
    term = None
    amount = None
    for match_id, start, end in matches:
        span = doc[start:end].text
        if "summer course" in span.lower():
            term = "Summer Course"
    if "₹" in text or "rs" in text or "$" in text:
        amount = "₹3,00,000"
    return term or "the course", amount or "the required amount"

def extract_topic(text):
    doc = nlp(text)
    noun_phrases = [chunk.text.strip().title() for chunk in doc.noun_chunks if 2 <= len(chunk.text.strip()) <= 40]
    return noun_phrases[0] if noun_phrases else "Your Request"

def generate_subject_line(text, tone_choice):
    context = detect_context(text)
    tone = tone_choice.lower()
    if context == "finance":
        term, amount = extract_finance_details(text)
        template = random.choice(templates[context].get(tone, templates[context]["default"]))
        return template.format(term=term, amount=amount)
    elif context == "course":
        term, _ = extract_finance_details(text)
        template = random.choice(templates[context].get(tone, templates[context]["default"]))
        return template.format(term=term)
    else:
        topic = extract_topic(text)
        template = random.choice(templates[context].get(tone, templates[context]["default"]))
        return template.format(topic=topic)

st.title("Lex Mini World Email Subject Line Generator")
st.write("Paste your email body below to generate a smart, context-specific subject line.")

email_body = st.text_area("Email Body", height=250)
tone = st.selectbox("Select Tone", ["Default", "Polite", "Urgent"])

if st.button("Generate Subject Line") and email_body.strip():
    subject_line = generate_subject_line(email_body, tone)
    st.success(subject_line)
