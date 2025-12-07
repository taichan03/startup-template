.PHONY: help dev test lint format create-admin reset-db migrations build clean

help: ## Show this help message
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

dev: ## Start local development (both frontend and backend)
	@echo "Starting development servers..."
	@docker-compose up -d postgres
	@echo "Waiting for PostgreSQL to be ready..."
	@sleep 3
	@cd backend && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
	@cd frontend && npm run dev

dev-backend: ## Start backend development server
	cd backend && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

dev-frontend: ## Start frontend development server
	cd frontend && npm run dev

test: ## Run all tests (frontend + backend)
	@echo "Running backend tests..."
	@cd backend && pytest
	@echo "Running frontend tests..."
	@cd frontend && npm run test

test-backend: ## Run backend tests only
	cd backend && pytest

test-frontend: ## Run frontend tests only
	cd frontend && npm run test

lint: ## Lint frontend and backend code
	@echo "Linting backend..."
	@cd backend && black --check . && isort --check-only . && flake8 .
	@echo "Linting frontend..."
	@cd frontend && npm run lint

format: ## Format code (frontend + backend)
	@echo "Formatting backend..."
	@cd backend && black . && isort .
	@echo "Formatting frontend..."
	@cd frontend && npm run format

create-admin: ## Create admin user
	cd backend && python -c "from app.services.seed import seed_data; seed_data()"

reset-db: ## Reset database (WARNING: deletes all data)
	@echo "WARNING: This will delete all data!"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		docker-compose down -v; \
		docker-compose up -d postgres; \
		sleep 3; \
		cd backend && alembic upgrade head; \
	fi

migrations: ## Create/apply database migrations
	cd backend && alembic revision --autogenerate -m "$(msg)"

migrate: ## Apply pending migrations
	cd backend && alembic upgrade head

build: ## Build Docker images
	docker-compose build

up: ## Start all services with Docker
	docker-compose up -d

down: ## Stop all services
	docker-compose down

clean: ## Clean up build artifacts and caches
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	find . -type d -name ".pytest_cache" -exec rm -rf {} +
	find . -type d -name "node_modules" -exec rm -rf {} +
	find . -type d -name "dist" -exec rm -rf {} +
