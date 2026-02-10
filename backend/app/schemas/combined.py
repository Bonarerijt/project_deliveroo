from pydantic import BaseModel
from typing import List
from .user import UserResponse
from .parcel import ParcelResponse

class ParcelWithUserResponse(ParcelResponse):
    user: UserResponse

class AdminDashboard(BaseModel):
    total_users: int
    total_parcels: int
    pending_parcels: int
    delivered_parcels: int
    total_revenue: float
    recent_parcels: List[ParcelWithUserResponse]
