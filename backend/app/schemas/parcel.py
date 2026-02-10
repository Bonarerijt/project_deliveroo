from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from enum import Enum

class WeightCategory(str, Enum):
    small = "small"
    medium = "medium"
    large = "large"

class ParcelStatus(str, Enum):
    pending = "pending"
    in_transit = "in_transit"
    delivered = "delivered"
    cancelled = "cancelled"

class ParcelBase(BaseModel):
    pickup_address: str
    destination_address: str
    pickup_lat: float
    pickup_lng: float
    destination_lat: float
    destination_lng: float
    weight_category: WeightCategory

class ParcelCreate(ParcelBase):
    pass

class ParcelUpdate(BaseModel):
    destination_address: Optional[str] = None
    destination_lat: Optional[float] = None
    destination_lng: Optional[float] = None
    status: Optional[ParcelStatus] = None
    present_location: Optional[str] = None

class ParcelResponse(ParcelBase):
    id: int
    user_id: int
    quote_amount: float
    status: ParcelStatus
    present_location: Optional[str] = None
    distance_km: Optional[float] = None
    duration_mins: Optional[int] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class MapRoute(BaseModel):
    distance: str
    duration: str
    polyline: str
