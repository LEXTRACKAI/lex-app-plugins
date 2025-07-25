import streamlit as st
import psutil
import time
import os
from datetime import datetime

st.set_page_config(page_title="App Health Dashboard", layout="wide")

error_log_path = "app_error.log"
start_time = time.time()

cpu_history = []
mem_history = []
time_labels = []

def get_app_status():
    try:
        streamlit_running = any("streamlit" in p.name().lower() for p in psutil.process_iter())
        uvicorn_running = any("uvicorn" in p.name().lower() for p in psutil.process_iter())
        return "Running" if streamlit_running or uvicorn_running else "Stopped"
    except Exception:
        return "Error"

def get_cpu_memory_usage():
    cpu = psutil.cpu_percent(interval=0.5)
    mem = psutil.virtual_memory().percent
    return cpu, mem

def get_uptime():
    uptime_seconds = int(time.time() - start_time)
    return str(datetime.utcfromtimestamp(uptime_seconds).strftime("%H:%M:%S"))

def get_error_count():
    if not os.path.exists(error_log_path):
        return 0
    with open(error_log_path, "r") as f:
        return len(f.readlines())

def calculate_health_score(status, cpu, mem, error_count):
    score = 100
    if status != "Running": score -= 40
    if cpu > 80: score -= 20
    if mem > 80: score -= 20
    if error_count > 0: score -= 10
    return max(score, 0)

# --- Layout ---
st.title("📊 App Health Monitoring Dashboard")

placeholder = st.empty()

while True:
    with placeholder.container():
        # Metrics
        status = get_app_status()
        cpu, mem = get_cpu_memory_usage()
        uptime = get_uptime()
        error_count = get_error_count()
        health_score = calculate_health_score(status, cpu, mem, error_count)

        cpu_history.append(cpu)
        mem_history.append(mem)
        time_labels.append(datetime.now().strftime("%H:%M:%S"))
        if len(cpu_history) > 20:
            cpu_history.pop(0)
            mem_history.pop(0)
            time_labels.pop(0)

        col1, col2, col3, col4 = st.columns(4)
        col1.metric("🔄 Status", status)
        col2.metric("⏱️ Uptime", uptime)
        col3.metric("❗ Errors", error_count)
        col4.metric("💯 Health Score", f"{health_score}/100")

        st.subheader("📉 CPU and Memory Usage (last 20 seconds)")
        st.line_chart({
            "CPU (%)": cpu_history,
            "Memory (%)": mem_history
        })

        time.sleep(3)
