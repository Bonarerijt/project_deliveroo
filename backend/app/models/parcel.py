from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, ForeignKey, Enum
from sqlalchemy.sql import func
from app.database.database import Base
import enum


class ParcelStatus(enum.Enum):
    pending = "pending"
    in_transit = "in_transit" 
    delivered = "delivered"
    cancelled = "cancelled"

class WeightCategory(enum.Enum):
    small = "small"
    medium = "medium"
    large = "large"