# lex-app-plugins

Monorepo for Lex App plugin system.

## Services

- **backend** – REST API for building and deploying mini-apps using Kubernetes.
- **builder-portal** – React UI to manage deployments.
- **gateway** – Routes `/apps/{appId}` to the deployed container for that app.
- **catalog-api** – placeholder for catalog functionality.

A GitHub Actions workflow builds and deploys mini-apps whenever `mini-app-template/manifest.json` changes.
# force trigger
