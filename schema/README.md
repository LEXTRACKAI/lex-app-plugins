# Lex App – API Schema

This schema defines the structure and requirements for all API interactions in the Lex App deployment and monitoring system.

---

## POST /api/deploy

Deploys a new mini app container.

### Payload

```json
{
  "name": "chatbot-mini-app",
  "image": "lex/chatbot-mini-app",
  "port": 8100,
  "image_name": "chatbot-mini-app",
  "version": "v1.0",
  "model": "chatbot-v1.0.pt",
  "metadata": {
    "created_by": "developer_name",
    "team": "NLP",
    "category": "chatbot"
  }
}
```

---

## GET /api/apps/<id>/status

Returns the current status of a running app.

```json
{
  "id": "chatbot-mini-app",
  "name": "chatbot-mini-app",
  "status": "running",
  "port": 8100,
  "image": "lex/chatbot-mini-app",
  "uptime": "3h 22m",
  "last_checked": "2025-06-26T14:10:00Z"
}
```

---

## GET /api/apps/<id>/logs

Returns recent logs from the container.

```json
{
  "id": "chatbot-mini-app",
  "logs": [
    "Container initialized",
    "Model chatbot-v1.0.pt loaded",
    "API running on port 8100"
  ]
}
```

---

## Log Structure (app-level)

- Logs are streamed to a central logger
- Logs are stored per app with timestamps
- May be stored in: file, database, or Elastic-based logging system

---

## app_registry.json Sample Structure

```json
{
  "chatbot-mini-app": {
    "id": "chatbot-mini-app",
    "name": "chatbot-mini-app",
    "image": "lex/chatbot-mini-app",
    "image_name": "chatbot-mini-app",
    "port": 8100,
    "status": "running",
    "container_id": "b83f13d2e8",
    "version": "v1.0",
    "model": "chatbot-v1.0.pt",
    "logs": "latest logs path or log stream",
    "metadata": {
      "created_by": "developer_name",
      "team": "NLP",
      "category": "chatbot"
    },
    "created_at": "2025-06-26T13:30:00Z"
  }
}
```
