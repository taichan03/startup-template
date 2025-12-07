#!/bin/bash
set -e

echo "Starting development entrypoint..."

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
while ! nc -z $POSTGRES_SERVER $POSTGRES_PORT; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 1
done
echo "PostgreSQL is up - continuing"

# Run database migrations
echo "Running database migrations..."
alembic upgrade head

# Seed initial data (admin user, etc.)
echo "Seeding initial data..."
python -c "from app.services.seed import seed_data; seed_data()"

# Start development server with hot reload
echo "Starting development server with hot reload..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
