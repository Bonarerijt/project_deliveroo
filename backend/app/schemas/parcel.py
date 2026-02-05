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