"""
Combined schemas for the application.
These schemas combine multiple models for complex responses.
"""

from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.schemas.parcel import ParcelStatus, WeightCategory
from app.schemas.user import UserResponse


class ParcelWithUser(BaseModel):
    """Parcel information including user details."""
    id: int
    user_id: int
    user: Optional[UserResponse] = None
    pickup_address: str
    destination_address: str
    pickup_lat: float
    pickup_lng: float
    destination_lat: float
    destination_lng: float
    weight_category: WeightCategory
    quote_amount: float
    status: ParcelStatus
    present_location: Optional[str] = None
    distance_km: Optional[float] = None
    duration_mins: Optional[int] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class UserWithParcels(BaseModel):
    """User information including their parcels."""
    id: int
    email: str
    username: str
    is_active: bool
    is_admin: bool
    created_at: datetime
    parcels: List["ParcelWithUser"] = []
    
    class Config:
        from_attributes = True


class AdminDashboardStats(BaseModel):
    """Dashboard statistics for admin."""
    total_users: int
    total_parcels: int
    pending_parcels: int
    in_transit_parcels: int
    delivered_parcels: int
    cancelled_parcels: int
    total_revenue: float
    
    class Config:
        from_attributes = True


class ParcelTrackingUpdate(BaseModel):
    """Parcel tracking update information."""
    parcel_id: int
    status: ParcelStatus
    present_location: str
    updated_at: datetime
    updated_by: Optional[int] = None


class MapRouteInfo(BaseModel):
    """Map route information for parcel delivery."""
    distance_km: float
    duration_mins: int
    pickup_lat: float
    pickup_lng: float
    destination_lat: float
    destination_lng: float
    steps: List[str] = []
    estimated_cost: float


# Update forward references
ParcelWithUser.model_rebuild()
UserWithParcels.model_rebuild()

