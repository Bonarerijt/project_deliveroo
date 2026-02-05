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


class Parcel(Base):
    __tablename__ = "parcels"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)


    # Addresses
    pickup_address = Column(String, nullable=False)
    destination_address = Column(String, nullable=False)

    # Coordinates
    pickup_lat = Column(Float, nullable=False)
    pickup_lng = Column(Float, nullable=False)
    destination_lat = Column(Float, nullable=False)
    destination_lng = Column(Float, nullable=False)

    # Parcel details
    weight_category = Column(Enum(WeightCategory), nullable=False)
    quote_amount = Column(Float, nullable=False)
    status = Column(Enum(ParcelStatus), default=ParcelStatus.pending, nullable=False)
    present_location = Column(String, nullable=True)

    # Calculated fields
    distance_km = Column(Float, nullable=True)
    duration_mins = Column(Integer, nullable=True)