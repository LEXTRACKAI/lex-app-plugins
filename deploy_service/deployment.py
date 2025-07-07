# deployment.py

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import docker
import uuid
import json
import os

app = FastAPI()
client = docker.from_env()

REGISTRY_FILE = "app_registry.json"

# Ensure app_registry.json exists
if not os.path.exists(REGISTRY_FILE):
    with open(REGISTRY_FILE, "w") as f:
        json.dump({}, f)

def save_registry(registry):
    with open(REGISTRY_FILE, "w") as f:
        json.dump(registry, f, indent=2)

def load_registry():
    with open(REGISTRY_FILE) as f:
        return json.load(f)

class DeployRequest(BaseModel):
    name: str
    image: str
    port: int
    image_name: str

@app.post("/api/deploy")
def deploy_app(request: DeployRequest):
    app_id = str(uuid.uuid4())
    registry = load_registry()

    try:
        container = client.containers.run(
            image=request.image_name,
            name=request.name,
            ports={f"{request.port}/tcp": request.port},
            detach=True
        )

        registry[app_id] = {
            "id": app_id,
            "name": request.name,
            "image": request.image,
            "port": request.port,
            "status": "running",
            "container_id": container.id,
            "logs": ""
        }
        save_registry(registry)
        return {"message": "App deployed", "app_id": app_id}

    except Exception as e:
        registry[app_id] = {
            "id": app_id,
            "name": request.name,
            "image": request.image,
            "port": request.port,
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
    return {"status": app_info["status"]}

@app.get("/api/apps/{app_id}/logs")
def get_app_logs(app_id: str):
    registry = load_registry()
    app_info = registry.get(app_id)
    if not app_info or not app_info["container_id"]:
        raise HTTPException(status_code=404, detail="Logs unavailable")

    try:
        container = client.containers.get(app_info["container_id"])
        logs = container.logs().decode("utf-8")
        return {"logs": logs}
    except Exception as e:
        return {"logs": f"Error fetching logs: {e}"}

