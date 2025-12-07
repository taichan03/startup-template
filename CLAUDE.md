# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Startup Template - Claude Code Context

## Project Overview

This is a production-ready, full-stack startup template designed for rapid prototyping and scalable deployment.

**Stack:**
- Backend: FastAPI + PostgreSQL + SQLAlchemy
- Frontend: React 18 + TypeScript + Vite + TailwindCSS
- DevOps: Docker + Docker Compose

**Version:** 1.0.0

## Architecture Overview

### Backend Architecture (FastAPI)

The backend follows a **layered architecture** pattern:

```
API Layer (routers/) → Service Layer (services/) → Data Layer (models/)
                  ↓                    ↓                     ↓
            Pydantic schemas     Business logic      SQLAlchemy ORM
```

**Key Design Patterns:**
- **Dependency Injection**: FastAPI's `Depends()` for DB sessions and authentication
- **Repository Pattern**: Service layer abstracts database operations
- **DTO Pattern**: Pydantic schemas separate API contracts from internal models
- **Middleware Pattern**: Custom middleware for logging, security headers, and request tracking

**File Structure:**
- `app/api/v1/routers/` - API endpoint handlers (controllers)
- `app/services/` - Business logic layer
- `app/models/` - SQLAlchemy ORM models (database schema)
- `app/schemas/` - Pydantic models (request/response validation)
- `app/core/` - Configuration, security, constants
- `app/middleware/` - Custom middleware
- `app/db/` - Database session management

### Frontend Architecture (React)

**Structure:**
- `src/pages/` - Page-level components (Login, Signup, Dashboard)
- `src/components/` - Reusable components (ProtectedRoute, etc.)
- `src/services/api.ts` - Centralized API client with automatic token refresh
- `src/hooks/` - Custom React hooks (useAuth)
- `src/types/` - TypeScript type definitions

## Development Guidelines

### Code Style

**Python (Backend):**
- Follow PEP 8 standards
- Use type hints for all function parameters and return values
- Async functions for I/O operations (database, external APIs)
- Docstrings for all public functions and classes
- Pre-commit hooks enforce: black, isort, flake8, mypy

**TypeScript (Frontend):**
- Functional components with TypeScript
- Use hooks for state management
- ESLint + Prettier for formatting
- Explicit type definitions (avoid `any`)

### Naming Conventions

**Backend:**
- Models: PascalCase (e.g., `User`, `Project`)
- Functions: snake_case (e.g., `create_user`, `get_project_by_id`)
- Files: snake_case (e.g., `user.py`, `auth.py`)
- Constants: UPPER_SNAKE_CASE (e.g., `ACCESS_TOKEN_EXPIRE_MINUTES`)

**Frontend:**
- Components: PascalCase (e.g., `Dashboard.tsx`, `ProtectedRoute.tsx`)
- Functions: camelCase (e.g., `fetchProjects`, `handleSubmit`)
- Files: PascalCase for components, camelCase for utilities

### Security Best Practices

**Authentication Flow:**
1. User logs in with email/password
2. Backend validates credentials and returns JWT access + refresh tokens
3. Access token (30 min expiry) used for authenticated requests
4. Refresh token (7 days expiry) used to get new access tokens
5. Tokens stored in localStorage (client-side)

**Important Security Notes:**
- `SECRET_KEY` in config.py is used to sign JWT tokens - MUST be changed in production
- Passwords are hashed with bcrypt (never stored in plaintext)
- CORS origins are configurable via `BACKEND_CORS_ORIGINS`
- Security headers middleware adds HSTS, X-Frame-Options, X-Content-Type-Options
- Rate limiting is stubbed (needs implementation for production)

**Role-Based Access Control:**
- `is_admin` flag on User model
- Admin-only endpoints use `get_current_admin_user` dependency
- Regular endpoints use `get_current_user` dependency

### Database Patterns

**Migrations:**
- Use Alembic for all schema changes
- Never modify models without creating a migration
- Command: `alembic revision --autogenerate -m "description"`
- Apply with: `alembic upgrade head`

**Service Layer Pattern:**
Example from [services/project.py](backend/app/services/project.py):
- All database operations go through service functions
- Services handle business logic and validation
- Routers should be thin - delegate to services

**Sessions:**
- Database sessions are injected via `get_db()` dependency
- Sessions are automatically committed/rolled back by FastAPI
- Always use `db.commit()` and `db.refresh()` after creating/updating

### Adding New Features

**To add a new resource (e.g., "Tasks"):**

1. Create model in `backend/app/models/task.py`
2. Create schemas in `backend/app/schemas/task.py` (TaskCreate, TaskUpdate, Task)
3. Create service in `backend/app/services/task.py` (create, read, update, delete)
4. Create router in `backend/app/api/v1/routers/task.py`
5. Register router in `backend/app/api/v1/routers/__init__.py`
6. Create migration: `alembic revision --autogenerate -m "add tasks table"`
7. Apply migration: `alembic upgrade head`

**Reference existing resources:**
- Copy patterns from `Project` resource (it's simpler than User)
- Projects have owner relationship to User - good example for foreign keys

### Environment Configuration

**Multiple environments supported:**
- `.env.development` - Local development
- `.env.test` - Testing
- `.env.production` - Production deployment

**How config works:**
- `BaseSettings` from pydantic-settings automatically loads from `.env` files
- Environment variables override `.env` file values
- Default values in code are fallbacks only
- All config in [backend/app/core/config.py](backend/app/core/config.py)

**Critical environment variables:**
- `SECRET_KEY` - JWT signing (MUST change in production)
- `POSTGRES_*` - Database connection
- `FIRST_SUPERUSER_EMAIL/PASSWORD` - Initial admin user
- `BACKEND_CORS_ORIGINS` - Allowed frontend origins (comma-separated)

### Testing

**Backend Tests:**
- Located in `backend/tests/`
- Uses pytest with fixtures
- Test database is separate from dev database
- Run all tests: `cd backend && pytest`
- Run with coverage: `cd backend && pytest --cov=app`
- Run specific test file: `cd backend && pytest tests/test_auth.py`
- Run specific test: `cd backend && pytest tests/test_auth.py::test_login`

**Frontend Tests:**
- Uses Vitest + React Testing Library
- Run all tests: `cd frontend && npm run test`
- Run with UI: `cd frontend && npm run test:ui`

## API Documentation

### Base URL
- Development: `http://localhost:8000/api/v1`
- Swagger docs: `http://localhost:8000/api/docs`
- ReDoc: `http://localhost:8000/api/redoc`

### Authentication Endpoints

**POST /api/v1/auth/register**
- Register new user
- Body: `{ email: string, password: string, full_name: string }`
- Returns: User object
- No auth required

**POST /api/v1/auth/login**
- Login and get tokens
- Body: `{ username: string, password: string }` (OAuth2 format - username is email)
- Returns: `{ access_token: string, refresh_token: string, token_type: "bearer" }`
- No auth required

**POST /api/v1/auth/refresh**
- Get new access token using refresh token
- Body: `{ refresh_token: string }`
- Returns: `{ access_token: string, token_type: "bearer" }`
- No auth required

**POST /api/v1/auth/logout**
- Logout (client-side only - removes tokens from localStorage)
- Auth required

### User Endpoints

**GET /api/v1/users/me**
- Get current authenticated user
- Returns: User object with projects
- Auth required

**PUT /api/v1/users/me**
- Update current user
- Body: `{ email?: string, full_name?: string, password?: string }`
- Returns: Updated user object
- Auth required

**GET /api/v1/users/**
- List all users (paginated)
- Query params: `skip`, `limit`
- Returns: Array of users
- Auth required (Admin only)

**GET /api/v1/users/{user_id}**
- Get specific user by ID
- Returns: User object
- Auth required (Admin only)

### Project Endpoints

**GET /api/v1/projects/**
- List current user's projects
- Query params: `skip`, `limit`
- Returns: Array of projects
- Auth required

**POST /api/v1/projects/**
- Create new project
- Body: `{ name: string, description?: string }`
- Returns: Created project
- Auth required

**GET /api/v1/projects/{project_id}**
- Get specific project
- Returns: Project object
- Auth required (owner or admin)

**PUT /api/v1/projects/{project_id}**
- Update project
- Body: `{ name?: string, description?: string }`
- Returns: Updated project
- Auth required (owner or admin)

**DELETE /api/v1/projects/{project_id}**
- Delete project
- Returns: Deleted project
- Auth required (owner or admin)

### Health Endpoints

**GET /health**
- Basic health check
- Returns: `{ status: "ok" }`
- No auth required

**GET /ready**
- Readiness check (includes database connectivity)
- Returns: `{ status: "ready", database: "connected" }`
- No auth required

**GET /metrics**
- Metrics endpoint (stub for Prometheus/monitoring)
- No auth required

## Common Tasks

### Running the Application

**Docker (recommended):**
```bash
# Development with hot reload
docker-compose up --build

# Production mode
docker-compose -f docker-compose.prod.yml up --build -d
```

**Local development:**
```bash
# Backend
cd backend
pip install -r requirements-dev.txt
uvicorn app.main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

### Docker Entrypoint System

The backend Docker container uses entrypoint scripts to handle initialization:

**Development Mode** ([backend/entrypoint-dev.sh](backend/entrypoint-dev.sh)):
- Waits for PostgreSQL to be ready
- Runs database migrations (`alembic upgrade head`)
- Seeds initial data (creates admin user)
- Starts uvicorn with hot reload (`--reload` flag)

**Production Mode** ([backend/entrypoint-prod.sh](backend/entrypoint-prod.sh)):
- Same initialization steps but without `--reload`

**How it works:**
- [backend/Dockerfile](backend/Dockerfile) copies `entrypoint-dev.sh` to `/entrypoint.sh`
- Docker Compose passes environment variables (POSTGRES_SERVER, POSTGRES_PORT)
- The entrypoint script ensures the database is ready before starting the app
- For production, use a separate Dockerfile that copies `entrypoint-prod.sh` instead

### Database Operations

**Create migration:**
```bash
cd backend
alembic revision --autogenerate -m "description"
```

**Apply migrations:**
```bash
alembic upgrade head
```

**Reset database (WARNING: deletes all data):**
```bash
make reset-db
```

**Seed admin user:**
- Automatically seeded on startup
- Configured via `FIRST_SUPERUSER_EMAIL` and `FIRST_SUPERUSER_PASSWORD`

### Common Development Commands

Available via Makefile:
- `make help` - Show all available commands
- `make dev` - Start local development (both frontend and backend)
- `make dev-backend` - Start backend development server only
- `make dev-frontend` - Start frontend development server only
- `make test` - Run all tests (frontend + backend)
- `make test-backend` - Run backend tests only
- `make test-frontend` - Run frontend tests only
- `make lint` - Lint all code
- `make format` - Format all code
- `make migrations msg="description"` - Create new migration
- `make migrate` - Apply migrations
- `make create-admin` - Create/seed admin user
- `make reset-db` - Reset database (WARNING: deletes all data)
- `make build` - Build Docker images
- `make up` - Start all Docker services
- `make down` - Stop all Docker services
- `make clean` - Clean up build artifacts and caches

## Key Files Reference

### Backend
- [backend/app/main.py](backend/app/main.py) - FastAPI app initialization, middleware setup
- [backend/app/core/config.py](backend/app/core/config.py) - All configuration and environment variables
- [backend/app/core/security.py](backend/app/core/security.py) - JWT token creation/verification, password hashing
- [backend/app/api/deps.py](backend/app/api/deps.py) - Dependency injection (DB session, current user)
- [backend/app/db/session.py](backend/app/db/session.py) - Database session and engine setup

### Frontend
- [frontend/src/services/api.ts](frontend/src/services/api.ts) - Axios client with token refresh
- [frontend/src/hooks/useAuth.tsx](frontend/src/hooks/useAuth.tsx) - Authentication hook
- [frontend/src/components/ProtectedRoute.tsx](frontend/src/components/ProtectedRoute.tsx) - Route guard component

## Known Limitations & TODOs

**Security:**
- Rate limiting is stubbed (needs implementation)
- Email verification not implemented
- Password reset sends stub email (needs real email service)
- No 2FA support

**Features:**
- Metrics endpoint is a stub
- No file upload functionality
- No WebSocket support
- No caching layer (Redis)
- No background job queue (Celery)

**Deployment:**
- GitHub Actions workflows are stubs
- No monitoring/observability setup (Sentry integration available but not configured)
- No database backup automation

## Troubleshooting

**Database connection errors:**
- Check PostgreSQL is running: `docker-compose ps`
- Verify DATABASE_URL is correct in logs
- Reset database: `make reset-db`

**CORS errors:**
- Ensure `BACKEND_CORS_ORIGINS` includes your frontend URL
- Development: Should include `http://localhost:5173`
- Check frontend is using correct API URL

**Token errors (401 Unauthorized):**
- Check SECRET_KEY hasn't changed (would invalidate all tokens)
- Verify token hasn't expired
- Check Authorization header format: `Bearer <token>`

**Migration conflicts:**
- View history: `alembic history`
- Downgrade: `alembic downgrade -1`
- Delete migration file and regenerate if needed
