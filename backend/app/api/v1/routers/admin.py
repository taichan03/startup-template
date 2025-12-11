from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.schemas.user import User, UserRoleUpdate, UserStats
from app.services import user as user_service
from app.api.deps import get_current_admin_user
from app.models.user import User as UserModel

router = APIRouter()


@router.get("/users", response_model=List[User])
def list_users(
    skip: int = 0,
    limit: int = 100,
    include_deleted: bool = False,
    current_user: UserModel = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Get list of all users (admin only).
    Can optionally include deleted users.
    """
    users = user_service.get_users_with_filters(
        db, skip=skip, limit=limit, include_deleted=include_deleted
    )
    return users


@router.get("/users/stats", response_model=UserStats)
def get_user_statistics(
    current_user: UserModel = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Get user statistics (admin only).
    Returns counts of total, active, inactive, admin, and deleted users.
    """
    stats = user_service.get_user_stats(db)
    return stats


@router.put("/users/{user_id}/deactivate", response_model=User)
def deactivate_user(
    user_id: int,
    current_user: UserModel = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Deactivate a user (admin only).
    Cannot deactivate yourself.
    """
    user = user_service.get_user(db, user_id=user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    user = user_service.deactivate_user(db, user=user, admin_user=current_user)
    return user


@router.put("/users/{user_id}/activate", response_model=User)
def activate_user(
    user_id: int,
    current_user: UserModel = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Activate a user (admin only).
    """
    user = user_service.get_user(db, user_id=user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    user = user_service.activate_user(db, user=user)
    return user


@router.put("/users/{user_id}/role", response_model=User)
def change_user_role(
    user_id: int,
    role_update: UserRoleUpdate,
    current_user: UserModel = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Change user role (admin only).
    Cannot change your own role.
    Prevents demoting the last admin.
    """
    user = user_service.get_user(db, user_id=user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    user = user_service.change_user_role(
        db, user=user, new_role=role_update.role, admin_user=current_user
    )
    return user


@router.delete("/users/{user_id}", response_model=User)
def delete_user(
    user_id: int,
    current_user: UserModel = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Soft delete a user (admin only).
    Cannot delete yourself.
    Prevents deleting the last admin.
    """
    user = user_service.get_user(db, user_id=user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    user = user_service.soft_delete_user(db, user=user, admin_user=current_user)
    return user
