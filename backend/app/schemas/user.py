from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from app.core.constants import UserRole


# Shared properties
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    is_active: bool = True
    role: UserRole = UserRole.USER


# Properties to receive via API on creation
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None


# Properties to receive via API on update
class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    full_name: Optional[str] = None
    is_active: Optional[bool] = None


# Properties shared by models stored in DB
class UserInDBBase(UserBase):
    id: int
    is_verified: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Properties to return to client
class User(UserInDBBase):
    is_deleted: Optional[bool] = None
    deleted_at: Optional[datetime] = None


# Properties stored in DB
class UserInDB(UserInDBBase):
    hashed_password: str


# Admin schemas
class UserRoleUpdate(BaseModel):
    """Update user role"""
    role: UserRole


class UserStats(BaseModel):
    """User statistics for admin dashboard"""
    total_users: int
    active_users: int
    inactive_users: int
    admin_users: int
    deleted_users: int
