from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.database import Base

class Parcel(Base):
    __tablename__ = "parcels"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
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
