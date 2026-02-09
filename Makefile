# Makefile for managing tests in a full-stack project with backend (Python) and frontend (JavaScript)

.PHONY: help install test test-backend test-frontend test-all coverage docker-test clean

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Install all test dependencies
	@echo "Installing backend dependencies..."
	cd backend && pip install -e ".[test]"
	@echo "Installing frontend dependencies..."
	cd frontend && npm install
	@echo "Installation complete!"

test-backend: ## Run backend tests
	@echo "Running backend tests..."
	cd backend && uv run pytest -v

test-backend-cov: ## Run backend tests with coverage
	@echo "Running backend tests with coverage..."
	cd backend && uv run pytest --cov=src/app --cov-report=html --cov-report=term-missing
	@echo "HTML report: backend/htmlcov/index.html"

test-frontend: ## Run frontend tests
	@echo "Running frontend tests..."
	cd frontend && npm test

test-frontend-cov: ## Run frontend tests with coverage
	@echo "Running frontend tests with coverage..."
	cd frontend && npm run test:coverage
	@echo "HTML report: frontend/coverage/index.html"

test-frontend-ui: ## Launch the frontend test UI
	@echo "Frontend test UI..."
	cd frontend && npm run test:ui

test-all: ## Run all tests (backend + frontend)
	@echo "Running all tests..."
	@make test-backend
	@make test-frontend
	@echo "All tests passed!"

coverage: ## Generate coverage reports for backend and frontend
	@make test-backend-cov
	@make test-frontend-cov
	@echo "Coverage reports generated!"

docker-test: ## Run tests inside Docker
	@echo "Running backend tests in Docker..."
	sudo docker compose -f docker-compose.test.yml run --rm backend-tests
	@echo "Running frontend tests in Docker..."
	sudo docker compose -f docker-compose.test.yml run --rm frontend-tests

docker-test-ui: ## Launch frontend test UI in Docker
	@echo "Frontend test UI in Docker..."
	@echo "Open http://localhost:51204"
	sudo docker compose -f docker-compose.test.yml up frontend-tests-ui

watch-backend: ## Run backend tests in watch mode
	cd backend && pip install pytest-watch && ptw -- -v

watch-frontend: ## Run frontend tests in watch mode
	cd frontend && npm test -- --watch

clean: ## Clean test and coverage files
	@echo "Cleaning..."
	rm -rf backend/htmlcov backend/.coverage backend/.pytest_cache
	rm -rf frontend/coverage frontend/node_modules/.vitest
	find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	@echo "Cleaning complete!"

setup: ## Set up the test environment
	@echo "Setting up test environment..."
	mkdir -p backend/tests
	touch backend/tests/__init__.py
	mkdir -p frontend/src/test
	@echo "Environment ready!"

check: ## Ensure all tests pass (for CI/CD)
	@make test-all
	@echo "Ready for commit/push!"

# Shortcuts
test: test-all ## Alias for test-all
t: test-all ## Short alias for test-all
tb: test-backend ## Short alias for test-backend
tf: test-frontend ## Short alias for test-frontend
c: coverage ## Short alias for coverage
