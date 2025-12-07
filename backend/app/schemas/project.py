from pydantic import BaseModel
from typing import Optional
from datetime import datetime


# Shared properties
class ProjectBase(BaseModel):
    title: str
    description: Optional[str] = None


# Properties to receive on creation
class ProjectCreate(ProjectBase):
    pass


# Properties to receive on update
class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None


# Properties shared by models stored in DB
class ProjectInDBBase(ProjectBase):
    id: int
    owner_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Properties to return to client
class Project(ProjectInDBBase):
    pass


# Properties stored in DB
class ProjectInDB(ProjectInDBBase):
    pass
