from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.schemas.user import User, UserUpdate
from app.services import user as user_service
from app.api.deps import get_current_active_user, get_current_admin_user
from app.models.user import User as UserModel

router = APIRouter()


@router.get("/me", response_model=User)
def read_user_me(current_user: UserModel = Depends(get_current_active_user)):
    """
    Get current user.
    """
    return current_user


@router.put("/me", response_model=User)
def update_user_me(
    user_update: UserUpdate,
    current_user: UserModel = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Update current user.
    """
    # Don't allow users to change their own role
    if user_update.model_dump(exclude_unset=True).get("role"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot change your own role"
        )

    user = user_service.update_user(db, user=current_user, user_update=user_update)
    return user


@router.get("/", response_model=List[User])
def read_users(
    skip: int = 0,
    limit: int = 100,
    current_user: UserModel = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Get list of users (admin only).
    """
    users = user_service.get_users(db, skip=skip, limit=limit)
    return users


@router.get("/{user_id}", response_model=User)
def read_user(
    user_id: int,
    current_user: UserModel = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Get user by ID (admin only).
    """
    user = user_service.get_user(db, user_id=user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user
