from typing import Optional, List
from sqlalchemy.orm import Session
from app.models.project import Project
from app.schemas.project import ProjectCreate, ProjectUpdate


def get_project(db: Session, project_id: int) -> Optional[Project]:
    """Get project by ID."""
    return db.query(Project).filter(Project.id == project_id).first()


def get_projects(db: Session, owner_id: Optional[int] = None, skip: int = 0, limit: int = 100) -> List[Project]:
    """Get list of projects, optionally filtered by owner."""
    query = db.query(Project)
    if owner_id is not None:
        query = query.filter(Project.owner_id == owner_id)
    return query.offset(skip).limit(limit).all()


def create_project(db: Session, project: ProjectCreate, owner_id: int) -> Project:
    """Create a new project."""
    db_project = Project(
        **project.model_dump(),
        owner_id=owner_id
    )
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project


def update_project(db: Session, project: Project, project_update: ProjectUpdate) -> Project:
    """Update a project."""
    update_data = project_update.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(project, field, value)

    db.add(project)
    db.commit()
    db.refresh(project)
    return project


def delete_project(db: Session, project: Project) -> Project:
    """Delete a project."""
    db.delete(project)
    db.commit()
    return project
