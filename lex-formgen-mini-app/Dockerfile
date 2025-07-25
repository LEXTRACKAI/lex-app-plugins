FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Copy all files
COPY . /app

COPY .env .env

# Install dependencies
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Expose both ports
EXPOSE 8000
EXPOSE 8501

# Run FastAPI and Streamlit simultaneously
CMD ["bash", "-c", "uvicorn backend:app --host 0.0.0.0 --port 8000 & streamlit run app.py --server.port=8501 --server.address=0.0.0.0"]
