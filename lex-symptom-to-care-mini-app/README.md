# Symptom to Care – AI Health Triage Mini App

## Run Locally
1. `pip install -r requirements.txt`
2. `uvicorn backend:app --reload --port 8000`
3. `streamlit run app.py --server.port=8501`

## Docker
```
docker build -t symptom-to-care-app .
docker run -p 8000:8000 -p 8501:8501 symptom-to-care-app
```

## Monitoring CLI
```
python monitor_cli.py
```