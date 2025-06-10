# lex-app-plugins

This repository contains the building blocks for the **Lex App** plugin ecosystem. Mini-apps are distributed as small Docker images and registered with a manifest describing how they integrate with the host application.

## Setup

1. Install [Docker](https://docs.docker.com/get-docker/) so you can build and run mini-app containers.
2. Clone this repository:

```bash
git clone <repo-url>
cd lex-app-plugins
```

Node.js is only required if you plan to develop the Builder Portal or Catalog API services.

## Directory layout

- `mini-app-template/` – example mini-app containing `index.html`, a `manifest.json` and a `Dockerfile`.
- `builder-portal/` – (future) web interface for publishing and managing mini-apps.
- `catalog-api/` – (future) API service that exposes registered mini-apps.
- `schema/` – JSON schema used to validate each mini-app's `manifest.json`.
- `.github/workflows/` – CI that builds the example mini-app and pushes it to GHCR.

### `/apps` convention

All mini-apps are mounted under `/apps/<appId>`. The `routes` field in `manifest.json` must follow this convention. The example template registers the path `/apps/hello-world`.

## Adding or building a mini-app

1. Copy `mini-app-template` to a new folder named after your `appId`.
2. Edit `manifest.json` – set a unique `appId`, update the `version`, and adjust the `routes` array to include your `/apps/...` path.
3. Customize the app's source files (e.g. `index.html` or any front-end framework).
4. Build the Docker image:

```bash
docker build -t ghcr.io/<owner>/lex-app-plugins/<appId>:<version> path/to/your-app
```

5. (Optional) run the container locally:

```bash
docker run -p 5000:80 ghcr.io/<owner>/lex-app-plugins/<appId>:<version>
```

Updates to `mini-app-template/manifest.json` automatically trigger the GitHub Actions workflow that builds and pushes the sample image.
