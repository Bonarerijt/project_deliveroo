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