from typing import Optional, List
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException, status
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import get_password_hash, verify_password
from app.core.constants import UserRole


def get_user(db: Session, user_id: int) -> Optional[User]:
    """Get user by ID."""
    return db.query(User).filter(User.id == user_id).first()


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """Get user by email (excludes deleted users)."""
    return db.query(User).filter(User.email == email, User.is_deleted == False).first()


def get_users(db: Session, skip: int = 0, limit: int = 100):
    """Get list of users (excludes deleted users)."""
    return db.query(User).filter(User.is_deleted == False).offset(skip).limit(limit).all()


def create_user(db: Session, user: UserCreate) -> User:
    """Create a new user."""
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        hashed_password=hashed_password,
        full_name=user.full_name,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def update_user(db: Session, user: User, user_update: UserUpdate) -> User:
    """Update a user."""
    update_data = user_update.model_dump(exclude_unset=True)

    if "password" in update_data:
        hashed_password = get_password_hash(update_data["password"])
        del update_data["password"]
        update_data["hashed_password"] = hashed_password

    for field, value in update_data.items():
        setattr(user, field, value)

    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def delete_user(db: Session, user: User) -> User:
    """Delete a user."""
    db.delete(user)
    db.commit()
    return user


def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
    """Authenticate a user."""
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user


# Admin service functions

def count_active_admins(db: Session) -> int:
    """Count active admin users (not deleted, not deactivated)."""
    return db.query(User).filter(
        User.role == UserRole.ADMIN,
        User.is_active == True,
        User.is_deleted == False
    ).count()


def get_users_with_filters(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    include_deleted: bool = False
) -> List[User]:
    """Get users with optional deleted filter."""
    query = db.query(User)

    if not include_deleted:
        query = query.filter(User.is_deleted == False)

    return query.offset(skip).limit(limit).all()


def deactivate_user(db: Session, user: User, admin_user: User) -> User:
    """Deactivate user. Validation: Cannot deactivate self."""
    if user.id == admin_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot deactivate your own account"
        )

    user.is_active = False
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def activate_user(db: Session, user: User) -> User:
    """Activate user."""
    user.is_active = True
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def change_user_role(db: Session, user: User, new_role: UserRole, admin_user: User) -> User:
    """Change user role. Validation: Cannot change own role, check last admin."""
    if user.id == admin_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot change your own role"
        )

    # If demoting from admin, check if this is the last admin
    if user.role == UserRole.ADMIN and new_role == UserRole.USER:
        admin_count = count_active_admins(db)
        if admin_count <= 1:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot demote the last admin user"
            )

    user.role = new_role
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def soft_delete_user(db: Session, user: User, admin_user: User) -> User:
    """Soft delete user. Validation: Cannot delete self or last admin."""
    if user.id == admin_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete your own account"
        )

    # If deleting an admin, check if this is the last admin
    if user.role == UserRole.ADMIN:
        admin_count = count_active_admins(db)
        if admin_count <= 1:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot delete the last admin user"
            )

    user.is_deleted = True
    user.deleted_at = datetime.utcnow()
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def get_user_stats(db: Session) -> dict:
    """Get user statistics for admin dashboard."""
    total_users = db.query(User).filter(User.is_deleted == False).count()
    active_users = db.query(User).filter(
        User.is_active == True,
        User.is_deleted == False
    ).count()
    inactive_users = db.query(User).filter(
        User.is_active == False,
        User.is_deleted == False
    ).count()
    admin_users = db.query(User).filter(
        User.role == UserRole.ADMIN,
        User.is_deleted == False
    ).count()
    deleted_users = db.query(User).filter(User.is_deleted == True).count()

    return {
        "total_users": total_users,
        "active_users": active_users,
        "inactive_users": inactive_users,
        "admin_users": admin_users,
        "deleted_users": deleted_users
    }
