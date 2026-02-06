"""
Schemas package for the Deliveroo application.
Contains Pydantic models for request/response validation.
"""

from app.schemas.user import UserBase, UserCreate, UserResponse, Token
from app.schemas.parcel import (
    ParcelBase, ParcelCreate, ParcelUpdate, ParcelResponse,
    ParcelStatus, WeightCategory, MapRoute
)
from app.schemas.combined import (
    ParcelWithUser, UserWithParcels, AdminDashboardStats,
    ParcelTrackingUpdate, MapRouteInfo
)

__all__ = [
    # User schemas
    "UserBase",
    "UserCreate", 
    "UserResponse",
    "Token",
    
    # Parcel schemas
    "ParcelBase",
    "ParcelCreate",
    "ParcelUpdate",
    "ParcelResponse",
    "ParcelStatus",
    "WeightCategory",
    "MapRoute",
    
    # Combined schemas
    "ParcelWithUser",
    "UserWithParcels",
    "AdminDashboardStats",
    "ParcelTrackingUpdate",
    "MapRouteInfo"
]

