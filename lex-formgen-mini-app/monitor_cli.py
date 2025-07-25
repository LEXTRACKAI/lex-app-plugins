import psutil
import platform
import time
import os
from datetime import datetime

start_time = time.time()
error_log_path = "app_error.log"

def get_app_status():
    try:
        streamlit_running = any("streamlit" in p.name().lower() for p in psutil.process_iter())
        uvicorn_running = any("uvicorn" in p.name().lower() for p in psutil.process_iter())
        return "Running" if streamlit_running or uvicorn_running else "Stopped"
    except Exception:
        return "Error"

def get_uptime():
    uptime_seconds = int(time.time() - start_time)
    return str(datetime.utcfromtimestamp(uptime_seconds).strftime("%H:%M:%S"))

def get_cpu_memory_usage():
    cpu = psutil.cpu_percent(interval=1)
    mem = psutil.virtual_memory()
    return cpu, mem.percent

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

def print_metrics():
    status = get_app_status()
    uptime = get_uptime()
    cpu, mem = get_cpu_memory_usage()
    error_count = get_error_count()
    health_score = calculate_health_score(status, cpu, mem, error_count)

    print(f"\n📊 App Health Metrics\n{'='*25}")
    print(f"Status       : {status}")
    print(f"Uptime       : {uptime}")
    print(f"CPU Usage    : {cpu}%")
    print(f"Memory Usage : {mem}%")
    print(f"Error Count  : {error_count}")
    print(f"Health Score : {health_score}/100")
    print(f"{'='*25}")

print_metrics()
