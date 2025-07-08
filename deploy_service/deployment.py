# deployment.py

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import docker
import uuid
import json
import os
from typing import Optional
from datetime import datetime
from port_utils import get_available_port,load_ports, save_ports

app = FastAPI()
client = docker.from_env()

REGISTRY_FILE = "app_registry.json"

if not os.path.exists(REGISTRY_FILE):
    with open(REGISTRY_FILE, "w") as f:
        json.dump({}, f)

def save_registry(registry):
    with open(REGISTRY_FILE, "w") as f:
        json.dump(registry, f, indent=2)

def load_registry():
    with open(REGISTRY_FILE) as f:
        return json.load(f)

class Metadata(BaseModel):
    created_by: str
    team: str
    category: str

class DeployRequest(BaseModel):
    name: str
    image: str
    port: int
    image_name: str
    version: str
    model: str
    metadata: Metadata

@app.post("/api/deploy")
def deploy_app(request: DeployRequest):
    app_id = str(uuid.uuid4())
    registry = load_registry()

    # Check if the user specified a port
    if request.port != 0:  # If the user provided a port
        used_ports = load_ports().get("used_ports", [])
        if request.port in used_ports or not is_port_free(request.port):
            raise HTTPException(status_code=400, detail=f"Port {request.port} is already in use or unavailable.")
        port = request.port
    else:
        port = get_available_port()  # Dynamically allocate a port

    try:
        container = client.containers.run(
            image=request.image_name,
            name=request.name,
            ports={f"{port}/tcp": port},
            detach=True
        )

        registry[app_id] = {
            "id": request.name,
            "name": request.name,
            "image": request.image,
            "image_name": request.image_name,
            "port": port,
            "status": "running",
            "container_id": container.id,
            "version": request.version,
            "model": request.model,
            "logs": "",
            "metadata": request.metadata.dict(),
            "created_at": datetime.utcnow().isoformat() + "Z"
        }
        save_registry(registry)
        return {"message": "App deployed", "app_id": app_id}

    except Exception as e:
        registry[app_id] = {
            "id": request.name,
            "name": request.name,
            "image": request.image,
            "port": port,
            "status": "failed",
            "logs": str(e),
            "container_id": None
        }
        save_registry(registry)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/apps/{app_id}/status")
def get_app_status(app_id: str):
    registry = load_registry()
    app_info = registry.get(app_id)
    if not app_info:
        raise HTTPException(status_code=404, detail="App not found")

    # Compute uptime
    try:
        created_at = datetime.fromisoformat(app_info["created_at"].replace("Z", ""))
        uptime_seconds = (datetime.utcnow() - created_at).total_seconds()
        hours = int(uptime_seconds // 3600)
        minutes = int((uptime_seconds % 3600) // 60)
        uptime = f"{hours}h {minutes}m"
    except:
        uptime = "unknown"

    return {
        "id": app_info["id"],
        "name": app_info["name"],
        "status": app_info["status"],
        "port": app_info["port"],
        "image": app_info["image"],
        "uptime": uptime,
        "last_checked": datetime.utcnow().isoformat() + "Z"
    }

@app.get("/api/apps/{app_id}/logs")
def get_app_logs(app_id: str):
    registry = load_registry()
    app_info = registry.get(app_id)
    if not app_info or not app_info["container_id"]:
        raise HTTPException(status_code=404, detail="Logs unavailable")

    try:
        container = client.containers.get(app_info["container_id"])
        logs = container.logs().decode("utf-8")
        return {
            "id": app_info["id"],
            "logs": logs.splitlines()
        }
    except Exception as e:
        return {"logs": f"Error fetching logs: {e}"}

