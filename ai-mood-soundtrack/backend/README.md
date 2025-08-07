# backend

This service exposes simple REST APIs for building and deploying mini-apps.

## Available endpoints

- `POST /build` – trigger a build for a mini-app
- `POST /deploy` – deploy a built image to Kubernetes
- `GET /deployments` – list active deployments

The server uses `@kubernetes/client-node` to communicate with the cluster.
