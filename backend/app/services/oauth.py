"""OAuth service layer for handling OAuth authentication and account linking."""

from typing import Optional, Tuple
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.user import User
from app.schemas.user import UserCreateOAuth
from app.core.constants import OAuthProvider
from app.core.security import get_password_hash
from datetime import datetime


def get_user_by_oauth(
    db: Session, provider: OAuthProvider, provider_id: str
) -> Optional[User]:
    """Get user by OAuth provider and provider ID."""
    return (
        db.query(User)
        .filter(
            User.oauth_provider == provider,
            User.oauth_provider_id == provider_id,
        )
        .first()
    )


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """Get user by email (excluding deleted users)."""
    return (
        db.query(User)
        .filter(User.email == email, User.is_deleted == False)
        .first()
    )


def create_oauth_user(db: Session, user_data: UserCreateOAuth) -> User:
    """Create a new user from OAuth data."""
    db_user = User(
        email=user_data.email,
        full_name=user_data.full_name,
        oauth_provider=user_data.oauth_provider,
        oauth_provider_id=user_data.oauth_provider_id,
        profile_picture_url=user_data.profile_picture_url,
        is_verified=user_data.is_verified,
        is_active=True,
        hashed_password=None,  # OAuth users don't have passwords initially
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def link_oauth_to_existing_user(
    db: Session,
    user: User,
    provider: OAuthProvider,
    provider_id: str,
    picture_url: Optional[str] = None,
) -> User:
    """Link OAuth provider to existing user account."""
    # Update user with OAuth information
    user.oauth_provider = provider
    user.oauth_provider_id = provider_id

    # Update profile picture if provided and user doesn't have one
    if picture_url and not user.profile_picture_url:
        user.profile_picture_url = picture_url

    # Auto-verify user if they authenticated via OAuth
    if not user.is_verified:
        user.is_verified = True

    db.commit()
    db.refresh(user)
    return user


def handle_oauth_login(
    db: Session,
    provider: OAuthProvider,
    provider_id: str,
    email: str,
    full_name: Optional[str] = None,
    picture: Optional[str] = None,
    email_verified: bool = False,
) -> Tuple[User, bool]:
    """
    Handle OAuth login flow with automatic account linking.

    Returns:
        Tuple[User, bool]: (user, is_new_user)

    Logic:
        1. Check if user exists with this OAuth provider ID → return existing user
        2. Check if user exists with matching email → link OAuth to account
        3. Otherwise → create new user
    """
    # Only allow verified emails from OAuth providers
    if not email_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email not verified by OAuth provider. Please verify your email with the provider.",
        )

    # Check if user already exists with this OAuth provider
    existing_oauth_user = get_user_by_oauth(db, provider, provider_id)
    if existing_oauth_user:
        # Check if user is active and not deleted
        if existing_oauth_user.is_deleted:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="This account has been deleted. Please contact support.",
            )
        if not existing_oauth_user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="This account has been deactivated. Please contact support.",
            )
        return existing_oauth_user, False

    # Check if user exists with matching email (account linking scenario)
    existing_email_user = get_user_by_email(db, email)
    if existing_email_user:
        # Check if user is active and not deleted
        if existing_email_user.is_deleted:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="This account has been deleted. Please contact support.",
            )
        if not existing_email_user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="This account has been deactivated. Please contact support.",
            )

        # Link OAuth to existing account
        linked_user = link_oauth_to_existing_user(
            db, existing_email_user, provider, provider_id, picture
        )
        return linked_user, False

    # Create new user
    user_data = UserCreateOAuth(
        email=email,
        full_name=full_name,
        oauth_provider=provider,
        oauth_provider_id=provider_id,
        profile_picture_url=picture,
        is_verified=True,  # Auto-verify OAuth users
    )
    new_user = create_oauth_user(db, user_data)
    return new_user, True


def add_password_to_oauth_user(db: Session, user: User, password: str) -> User:
    """Add a password to an OAuth-only user account."""
    if user.hashed_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This account already has a password. Use the password reset flow to change it.",
        )

    # Hash and set the password
    user.hashed_password = get_password_hash(password)
    db.commit()
    db.refresh(user)
    return user
