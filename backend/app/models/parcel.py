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

from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.database import Base

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

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    
    # Address fields
    pickup_address = Column(String, nullable=False)
    destination_address = Column(String, nullable=False)
    
    # Coordinates
    pickup_lat = Column(Float, default=0)
    pickup_lng = Column(Float, default=0)
    destination_lat = Column(Float, default=0)
    destination_lng = Column(Float, default=0)
    
    # Package details
    weight_category = Column(String, default='medium')
    quote_amount = Column(Float, default=0)
    distance_km = Column(Float, default=0)
    duration_mins = Column(Integer, default=0)
    
    # Status tracking
    status = Column(String, default='pending')
    present_location = Column(String, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="parcels")
