from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import json
import os
import docker

app = FastAPI()
client = docker.from_env()
REGISTRY_PATH = "deploy_service/app_registry.json"

class AppDeployment(BaseModel):
    name: str
    image: str
    port: int
    image_name: str

def load_registry():
    if not os.path.exists(REGISTRY_PATH):
        return {}
    with open(REGISTRY_PATH, "r") as f:
        return json.load(f)

def save_registry(data):
    with open(REGISTRY_PATH, "w") as f:
        json.dump(data, f, indent=2)

@app.post("/api/deploy")
def deploy_app(payload: AppDeployment):
    registry = load_registry()
    app_id = payload.name
    port = payload.port
    image = payload.image
    try:
        container = client.containers.run(
            image,
            name=app_id,
            detach=True,
            ports={"8000/tcp": port},
            auto_remove=True
        )
        status = "running"
        logs = container.logs(stdout=False, stderr=True).decode("utf-8")
        container_id = container.id
    except Exception as e:
        status = "failed"
        logs = str(e)
        container_id = None
    registry[app_id] = {
        "id": app_id,
        "name": payload.name,
        "port": port,
        "status": status,
        "container_id": container_id,
        "logs": logs
    }
    save_registry(registry)
    return {"message": "App deployed", "app": registry[app_id]}

@app.get("/api/apps/{app_id}/status")
def get_status(app_id: str):
    registry = load_registry()
    if app_id not in registry:
        raise HTTPException(status_code=404, detail="App not found")
    return {"status": registry[app_id]["status"]}

@app.get("/api/apps/{app_id}/logs")
def get_logs(app_id: str):
    registry = load_registry()
    if app_id not in registry:
        raise HTTPException(status_code=404, detail="App not found")
    return {"logs": registry[app_id]["logs"]}

