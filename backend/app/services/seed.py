import logging
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.services import user as user_service, project as project_service
from app.schemas.user import UserCreate
from app.schemas.project import ProjectCreate
from app.core.config import settings
from app.core.constants import UserRole

logger = logging.getLogger(__name__)


def seed_data():
    """
    Seed initial data (admin user and sample projects).
    Runs automatically on startup.
    """
    db: Session = SessionLocal()

    try:
        # Create admin user if not exists
        admin = user_service.get_user_by_email(db, email=settings.FIRST_SUPERUSER_EMAIL)
        if not admin:
            logger.info("Creating admin user...")
            admin_user = UserCreate(
                email=settings.FIRST_SUPERUSER_EMAIL,
                password=settings.FIRST_SUPERUSER_PASSWORD,
                full_name="Admin User"
            )
            admin = user_service.create_user(db, user=admin_user)
            # Set admin role
            admin.role = UserRole.ADMIN
            admin.is_verified = True
            db.commit()
            db.refresh(admin)
            logger.info(f"Admin user created: {admin.email}")

            # Create sample projects for admin
            sample_projects = [
                ProjectCreate(
                    title="Sample Project 1",
                    description="This is a sample project to demonstrate the CRUD functionality."
                ),
                ProjectCreate(
                    title="Sample Project 2",
                    description="Another example project with different content."
                ),
                ProjectCreate(
                    title="Sample Project 3",
                    description="A third project to show multiple items in the list."
                ),
            ]

            for project_data in sample_projects:
                project_service.create_project(db, project=project_data, owner_id=admin.id)

            logger.info("Sample projects created")
        else:
            logger.info("Admin user already exists, skipping seed")

    except Exception as e:
        logger.error(f"Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()
