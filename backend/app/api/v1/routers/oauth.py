"""OAuth authentication endpoints for Google, GitHub, Microsoft, etc."""

from fastapi import APIRouter, Depends, Request, HTTPException, status, Response
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from authlib.integrations.starlette_client import OAuth
from typing import Optional

from app.api.deps import get_db, get_current_user
from app.core.config import settings
from app.core.security import create_access_token, create_refresh_token
from app.core.constants import OAuthProvider
from app.services import oauth as oauth_service
from app.models.user import User
from app.schemas.user import User as UserSchema, AddPasswordRequest

router = APIRouter()

# Initialize OAuth client
oauth = OAuth()

# Register Google OAuth provider
if settings.GOOGLE_CLIENT_ID and settings.GOOGLE_CLIENT_SECRET:
    oauth.register(
        name='google',
        client_id=settings.GOOGLE_CLIENT_ID,
        client_secret=settings.GOOGLE_CLIENT_SECRET,
        server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
        client_kwargs={
            'scope': 'openid email profile'
        }
    )


@router.get("/google/login")
async def google_login(request: Request):
    """
    Initiate Google OAuth login flow.
    Redirects user to Google's consent screen.
    """
    if not settings.GOOGLE_CLIENT_ID or not settings.GOOGLE_CLIENT_SECRET:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="Google OAuth is not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in environment variables."
        )

    redirect_uri = settings.GOOGLE_REDIRECT_URI
    return await oauth.google.authorize_redirect(request, redirect_uri)


@router.get("/google/callback")
async def google_callback(request: Request, db: Session = Depends(get_db)):
    """
    Handle Google OAuth callback.
    Exchanges code for token, gets user info, creates/links account, generates JWT tokens.
    """
    if not settings.GOOGLE_CLIENT_ID or not settings.GOOGLE_CLIENT_SECRET:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="Google OAuth is not configured."
        )

    try:
        # Exchange authorization code for access token
        token = await oauth.google.authorize_access_token(request)

        # Get user info from Google
        user_info = token.get('userinfo')
        if not user_info:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to get user information from Google"
            )

        # Extract user data
        email = user_info.get('email')
        email_verified = user_info.get('email_verified', False)
        full_name = user_info.get('name')
        picture = user_info.get('picture')
        google_id = user_info.get('sub')  # Google's unique user ID

        if not email or not google_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Missing required user information from Google"
            )

        # Handle OAuth login (create or link account)
        user, is_new = oauth_service.handle_oauth_login(
            db=db,
            provider=OAuthProvider.GOOGLE,
            provider_id=google_id,
            email=email,
            full_name=full_name,
            picture=picture,
            email_verified=email_verified
        )

        # Generate JWT tokens
        access_token = create_access_token(subject=str(user.id))
        refresh_token_value = create_refresh_token(subject=str(user.id))

        # Create redirect response to frontend
        frontend_url = settings.FRONTEND_URL
        redirect_url = f"{frontend_url}/auth/callback"

        response = RedirectResponse(url=redirect_url)

        # Set httpOnly cookies
        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            secure=settings.SECURE_COOKIES,
            samesite="lax",
            max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        )

        response.set_cookie(
            key="refresh_token",
            value=refresh_token_value,
            httponly=True,
            secure=settings.SECURE_COOKIES,
            samesite="lax",
            max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
        )

        return response

    except HTTPException:
        raise
    except Exception as e:
        # Log error in production
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"OAuth authentication failed: {str(e)}"
        )


@router.post("/add-password", response_model=UserSchema)
def add_password_to_account(
    request: AddPasswordRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Add a password to an OAuth-only account.
    Allows OAuth users to also login with email/password.
    """
    user = oauth_service.add_password_to_oauth_user(db, current_user, request.password)
    return user
