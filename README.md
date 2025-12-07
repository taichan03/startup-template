# Startup Template

A production-ready, full-stack startup template with React + TypeScript + Vite frontend and FastAPI + PostgreSQL backend. Designed for rapid prototyping and scalable deployment.

## Features

### Backend (FastAPI)
- **FastAPI** with Python 3.11+
- **PostgreSQL** database with SQLAlchemy ORM
- **JWT Authentication** with access and refresh tokens
- **Role-based access control** (user/admin)
- **Alembic** database migrations
- **Password hashing** with bcrypt
- **CORS** configured for cross-origin requests
- **Structured logging** with request IDs
- **Security headers** middleware (HSTS, X-Frame-Options, etc.)
- **Health & readiness** endpoints for load balancers
- **Auto-generated API docs** at `/api/docs` (Swagger) and `/api/redoc`
- **Pytest** with test fixtures and integration tests
- **Pre-commit hooks** for code quality (black, isort, flake8, mypy)

### Frontend (React + Vite)
- **React 18** with TypeScript
- **Vite** for fast development and optimized builds
- **TailwindCSS** for utility-first styling
- **React Router** for client-side routing
- **Protected routes** with authentication
- **API client** with automatic token refresh
- **Login/Signup** pages
- **Dashboard** with CRUD operations
- **Vitest + React Testing Library** for component tests
- **ESLint + Prettier** for code formatting

### DevOps
- **Docker** support with multi-stage builds
- **docker-compose** for local development
- **PostgreSQL** with volume persistence
- **Optional pgAdmin** for database management
- **GitHub Actions** CI/CD pipeline
- **Makefile** for common development tasks
- **.editorconfig** for consistent formatting

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local frontend development)
- Python 3.11+ (for local backend development)

### 1. Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd Startup-Template

# Copy environment file
cp .env.example .env.development
```

### 2. Run with Docker

**Development Mode (with hot reload):**
```bash
# Start all services with hot reload enabled
docker-compose up --build

# Access the application
# Frontend: http://localhost:5173 (Vite dev server with hot reload)
# Backend API: http://localhost:8000 (with auto-reload)
# API Docs: http://localhost:8000/docs

# Any changes to your code will automatically reload!
```

**Production Mode:**
```bash
# Start all services in production mode
docker-compose -f docker-compose.prod.yml up --build -d

# Access the application
# Frontend: http://localhost:80 (optimized production build)
# Backend API: http://localhost:8000 (production mode)
# API Docs: http://localhost:8000/docs
```

### 3. Run Locally (without Docker)

**Backend:**
```bash
# Install dependencies
cd backend
pip install -r requirements-dev.txt

# Start PostgreSQL
docker-compose up -d postgres

# Run backend
uvicorn app.main:app --reload

# Backend will be available at http://localhost:8000
```

**Frontend:**
```bash
# Install dependencies
cd frontend
npm install

# Start dev server
npm run dev

# Frontend will be available at http://localhost:5173
```

## Development vs Production

| Feature | Development (`docker-compose.yml`) | Production (`docker-compose.prod.yml`) |
|---------|-----------------------------------|----------------------------------------|
| **Frontend** | Vite dev server with hot reload on port 5173 | Optimized build served by Nginx on port 80 |
| **Backend** | Auto-reload enabled with `--reload` flag | Standard production mode |
| **Code Changes** | Auto-reload on file changes | Requires rebuild |
| **Volumes** | Source code mounted for live updates | No volumes (code baked into image) |
| **API URL** | http://localhost:8000 | http://localhost:8000 (or your domain) |
| **Best For** | Active development & debugging | Testing production builds & deployment |

## Default Credentials

**Admin User:**
- Email: `admin@example.com`
- Password: `admin123`

**Change these in production!** Update `FIRST_SUPERUSER_EMAIL` and `FIRST_SUPERUSER_PASSWORD` in your `.env` file.

## Environment Variables

Copy `.env.example` to create environment-specific files:

- `.env.development` - Local development
- `.env.production` - Production deployment
- `.env.test` - Testing environment

**Important variables:**
- `SECRET_KEY` - JWT signing key (generate a secure one for production!)
- `POSTGRES_*` - Database connection settings
- `BACKEND_CORS_ORIGINS` - Allowed frontend origins
- `FIRST_SUPERUSER_*` - Initial admin user credentials

See [.env.example](.env.example) for all available options.

## Development Commands (Makefile)

```bash
make help              # Show all available commands
make dev               # Start local development (both frontend and backend)
make test              # Run all tests
make lint              # Lint all code
make format            # Format all code
make create-admin      # Create/seed admin user
make reset-db          # Reset database (WARNING: deletes all data)
make migrations        # Create new migration (use: make migrations msg="your message")
make migrate           # Apply pending migrations
make build             # Build Docker images
make up                # Start all Docker services
make down              # Stop all Docker services
make clean             # Clean up build artifacts
```

## Running Tests

**Backend tests:**
```bash
cd backend
pytest                          # Run all tests
pytest --cov=app               # Run with coverage
pytest tests/test_auth.py      # Run specific test file
```

**Frontend tests:**
```bash
cd frontend
npm run test           # Run tests
npm run test:ui        # Run with UI
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login (returns access + refresh tokens)
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Logout (client-side token removal)
- `POST /api/v1/auth/password-reset` - Password reset (stub)

### Users
- `GET /api/v1/users/me` - Get current user
- `PUT /api/v1/users/me` - Update current user
- `GET /api/v1/users/` - List all users (admin only)
- `GET /api/v1/users/{id}` - Get user by ID (admin only)

### Projects
- `GET /api/v1/projects/` - List user's projects
- `POST /api/v1/projects/` - Create project
- `GET /api/v1/projects/{id}` - Get project details
- `PUT /api/v1/projects/{id}` - Update project
- `DELETE /api/v1/projects/{id}` - Delete project

### Health
- `GET /health` - Health check
- `GET /ready` - Readiness check (includes DB check)
- `GET /metrics` - Metrics endpoint (stub)

## Database Migrations

```bash
# Create a new migration
cd backend
alembic revision --autogenerate -m "description of changes"

# Apply migrations
alembic upgrade head

# Rollback last migration
alembic downgrade -1

# View migration history
alembic history
```

## Project Structure

```
.
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── deps.py              # Dependencies (auth, DB session)
│   │   │   └── v1/
│   │   │       └── routers/         # API route handlers
│   │   │           ├── auth.py
│   │   │           ├── users.py
│   │   │           ├── projects.py
│   │   │           └── health.py
│   │   ├── core/
│   │   │   ├── config.py            # Settings & configuration
│   │   │   ├── security.py          # JWT & password hashing
│   │   │   └── constants.py         # App constants
│   │   ├── db/
│   │   │   └── session.py           # Database session
│   │   ├── models/                  # SQLAlchemy models
│   │   │   ├── user.py
│   │   │   └── project.py
│   │   ├── schemas/                 # Pydantic schemas
│   │   │   ├── user.py
│   │   │   ├── project.py
│   │   │   └── token.py
│   │   ├── services/                # Business logic
│   │   │   ├── user.py
│   │   │   ├── project.py
│   │   │   └── seed.py
│   │   ├── middleware/              # Custom middleware
│   │   │   ├── logging.py
│   │   │   └── security.py
│   │   └── main.py                  # FastAPI app entrypoint
│   ├── alembic/                     # Database migrations
│   ├── tests/                       # Backend tests
│   ├── requirements.txt
│   ├── requirements-dev.txt
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── components/              # React components
│   │   │   └── ProtectedRoute.tsx
│   │   ├── hooks/                   # Custom React hooks
│   │   │   └── useAuth.tsx
│   │   ├── pages/                   # Page components
│   │   │   ├── Login.tsx
│   │   │   ├── Signup.tsx
│   │   │   └── Dashboard.tsx
│   │   ├── services/                # API client
│   │   │   └── api.ts
│   │   ├── types/                   # TypeScript types
│   │   │   └── index.ts
│   │   ├── tests/                   # Frontend tests
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── Dockerfile
│
├── .github/
│   └── workflows/
│       ├── ci.yml                   # CI pipeline
│       └── deploy.yml               # Deployment (stub)
│
├── docker-compose.yml
├── Makefile
├── .env.example
├── .env.development
├── .env.test
├── .pre-commit-config.yaml
├── .editorconfig
├── .gitignore
└── README.md
```

## Adding New Features

### 1. Add a New Backend Resource

Example: Adding a "Notes" resource

**Create model** (`backend/app/models/note.py`):
```python
from sqlalchemy import Column, Integer, String, Text, ForeignKey
from app.db.session import Base

class Note(Base):
    __tablename__ = "notes"
    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    content = Column(Text)
    owner_id = Column(Integer, ForeignKey("users.id"))
```

**Create schema** (`backend/app/schemas/note.py`):
```python
from pydantic import BaseModel

class NoteCreate(BaseModel):
    title: str
    content: str

class Note(BaseModel):
    id: int
    title: str
    content: str
    owner_id: int
```

**Create service** (`backend/app/services/note.py`):
```python
# Copy and adapt from project.py
```

**Create router** (`backend/app/api/v1/routers/note.py`):
```python
# Copy and adapt from projects.py
```

**Register router** in `backend/app/api/v1/routers/__init__.py`:
```python
from app.api.v1.routers import notes
api_router.include_router(notes.router, prefix="/notes", tags=["notes"])
```

**Create migration**:
```bash
cd backend
alembic revision --autogenerate -m "add notes table"
alembic upgrade head
```

### 2. Add a New Frontend Page

Follow the pattern in `src/pages/Dashboard.tsx` for CRUD operations.

## Security Best Practices

- [ ] Change `SECRET_KEY` in production (use a strong random key)
- [ ] Update default admin credentials
- [ ] Enable HTTPS in production
- [ ] Set up proper CORS origins
- [ ] Implement rate limiting (currently a stub)
- [ ] Enable email verification for new users
- [ ] Implement password reset with email
- [ ] Set up Sentry or error tracking
- [ ] Use environment-specific .env files
- [ ] Never commit .env files to git
- [ ] Review and update security headers
- [ ] Set up database backups
- [ ] Use secrets management (AWS Secrets Manager, etc.)

## Deployment

### Docker Deployment

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Run in production mode
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop services
docker-compose -f docker-compose.prod.yml down
```

**Important for Production:**
- Update `.env` file with production values
- Change `SECRET_KEY` to a strong random value
- Update database credentials
- Set proper `BACKEND_CORS_ORIGINS`
- Consider using a reverse proxy (Nginx/Traefik) in front of services

### Manual Deployment

1. Set up PostgreSQL database
2. Configure environment variables
3. Build frontend: `cd frontend && npm run build`
4. Serve frontend with Nginx
5. Run backend: `cd backend && uvicorn app.main:app --host 0.0.0.0 --port 8000`

### Cloud Deployment (Stubs)

The template includes deployment workflow stubs for:
- AWS ECR/ECS
- Azure Container Registry/App Service
- Fly.io

See [.github/workflows/deploy.yml](.github/workflows/deploy.yml) for configuration.

## Secrets Management

For production, use a secrets management service:

**AWS:**
```python
# Use AWS Secrets Manager or Parameter Store
import boto3

secret = boto3.client('secretsmanager').get_secret_value(SecretId='myapp/secret_key')
```

**Environment Variables (Docker/Kubernetes):**
- Use Docker secrets
- Use Kubernetes secrets
- Use .env files (not committed to git)

## Troubleshooting

### Database connection issues
```bash
# Check if PostgreSQL is running
docker-compose ps

# View PostgreSQL logs
docker-compose logs postgres

# Reset database
make reset-db
```

### Frontend can't connect to backend
- Check CORS settings in `backend/.env` (BACKEND_CORS_ORIGINS)
  - Development: Should include `http://localhost:5173` (Vite dev server)
  - Production: Should include `http://localhost` (Nginx on port 80)
- Ensure backend is running on the expected port (8000)
- Check `VITE_API_URL` in frontend .env
- If running in Docker dev mode, frontend is on port 5173
- If running in Docker production mode, frontend is on port 80

### Migration issues
```bash
# View current migration version
cd backend && alembic current

# View migration history
alembic history

# Downgrade to previous version
alembic downgrade -1
```

## License

MIT License - feel free to use this template for your projects.

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## Support

For issues and questions, please open an issue on GitHub.
