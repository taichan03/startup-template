from enum import Enum


class UserRole(str, Enum):
    USER = "user"
    ADMIN = "admin"


class OAuthProvider(str, Enum):
    LOCAL = "local"
    GOOGLE = "google"
    GITHUB = "github"
    MICROSOFT = "microsoft"
