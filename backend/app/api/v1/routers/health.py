from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.db.session import get_db

router = APIRouter()


@router.get("/health")
def health_check():
    """
    Health check endpoint for load balancers.
    """
    return {"status": "healthy"}


@router.get("/ready")
def readiness_check(db: Session = Depends(get_db)):
    """
    Readiness check endpoint for Kubernetes.
    Checks database connectivity.
    """
    try:
        # Check database connection
        db.execute(text("SELECT 1"))
        return {"status": "ready"}
    except Exception as e:
        return {"status": "not ready", "error": str(e)}, status.HTTP_503_SERVICE_UNAVAILABLE


@router.get("/metrics")
def metrics():
    """
    Prometheus-style metrics endpoint (stub).

    In production, integrate with prometheus_client library.
    """
    # TODO: Implement actual metrics collection
    return {
        "requests_total": 0,
        "requests_in_progress": 0,
        "response_time_seconds": 0,
    }
