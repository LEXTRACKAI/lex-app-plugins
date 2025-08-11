# Study Buddy Docker Management
.PHONY: help build run stop clean logs shell test deploy

# Default target
help: ## Show this help message
	@echo "Study Buddy Application - Docker Commands"
	@echo "========================================"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

build: ## Build the Docker image
	@echo "Building Study Buddy Docker image..."
	docker-compose build --no-cache

run: ## Run the application
	@echo "Starting Study Buddy application..."
	docker-compose up -d
	@echo "Application is running at http://localhost:8080"

stop: ## Stop the application
	@echo "Stopping Study Buddy application..."
	docker-compose down

restart: stop run ## Restart the application

logs: ## View application logs
	docker-compose logs -f study-buddy

logs-tail: ## View last 100 lines of logs
	docker-compose logs --tail=100 study-buddy

shell: ## Get shell access to the container
	docker-compose exec study-buddy sh

status: ## Show container status
	docker-compose ps

clean: ## Clean up containers and images
	@echo "Cleaning up Docker resources..."
	docker-compose down --volumes --remove-orphans
	docker system prune -f

clean-all: ## Clean everything including images
	@echo "Cleaning up all Docker resources..."
	docker-compose down --volumes --remove-orphans
	docker system prune -a -f

test: ## Test the application health
	@echo "Testing application health..."
	@curl -f http://localhost:8080/health || echo "Application is not responding"

deploy: build run ## Build and deploy the application
	@echo "Study Buddy deployed successfully!"
	@echo "Access the application at: http://localhost:8080"

backup-config: ## Backup configuration files
	@echo "Backing up configuration..."
	@mkdir -p backup
	@cp config.js backup/config-$(shell date +%Y%m%d-%H%M%S).js
	@echo "Configuration backed up to backup/ directory"

update-config: ## Update configuration in running container
	@echo "Updating configuration..."
	docker-compose restart study-buddy
	@echo "Configuration updated and container restarted"

dev: ## Development mode with file watching
	@echo "Starting in development mode..."
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

prod: ## Production deployment
	@echo "Starting in production mode..."
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Docker image management
push: ## Push image to registry (configure registry first)
	docker tag study-buddy:latest your-registry/study-buddy:latest
	docker push your-registry/study-buddy:latest

pull: ## Pull latest image from registry
	docker pull your-registry/study-buddy:latest

# Monitoring
stats: ## Show container resource usage
	docker stats study-buddy-app

inspect: ## Inspect container details
	docker inspect study-buddy-app

# Security
scan: ## Scan image for vulnerabilities (requires docker scan)
	docker scan study-buddy:latest

# Quick commands
up: run     ## Alias for run
down: stop  ## Alias for stop