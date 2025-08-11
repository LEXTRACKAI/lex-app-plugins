# agent_monitor.py
import docker
import time
import requests

BACKEND_API_URL = "http://localhost:8000/agents"  # Change this to your backend URL

client = docker.from_env()

def extract_agent_metadata(container):
    try:
        name = container.name
        labels = container.labels
        skills = labels.get("skills", "").split(",")
        impact = labels.get("impact", "")
        team = labels.get("team", "")
        status = container.status
        latency = float(labels.get("latency_ms", "0"))
        frequency = int(labels.get("frequency", "0"))

        return {
            "name": name,
            "skills": skills,
            "impact": impact,
            "team": team,
            "status": status,
            "latency_ms": latency,
            "frequency": frequency
        }
    except Exception as e:
        print(f"Error extracting metadata: {e}")
        return None

def send_to_backend(agent_data):
    try:
        response = requests.post(BACKEND_API_URL, json=agent_data)
        if response.status_code != 200:
            print(f"Failed to send data: {response.text}")
    except Exception as e:
        print(f"Error sending data: {e}")

def monitor_agents(interval=60):
    while True:
        containers = client.containers.list()
        for container in containers:
            agent_metadata = extract_agent_metadata(container)
            if agent_metadata:
                send_to_backend(agent_metadata)
        time.sleep(interval)

if __name__ == "__main__":
    monitor_agents()
