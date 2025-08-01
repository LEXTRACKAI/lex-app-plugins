FROM python:3.10-slim
WORKDIR /app
COPY . /app

# Install dependencies
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy environment file
COPY .env .env

EXPOSE 8000 8501

CMD ["bash","-c","uvicorn backend:app --host 0.0.0.0 --port 8000 & streamlit run app.py --server.port=8501 --server.address=0.0.0.0"]
