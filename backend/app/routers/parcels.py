from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from app.database.database import get_db
from app.models.user import User
from app.models.parcel import Parcel
from jose import JWTError, jwt
import os

router = APIRouter()

SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"

class ParcelCreate(BaseModel):
    pickup_address: str
    destination_address: str
    weight_category: str = 'medium'
    pickup_lat: float = 0
    pickup_lng: float = 0
    destination_lat: float = 0
    destination_lng: float = 0

class ParcelUpdate(BaseModel):
    status: Optional[str] = None
    present_location: Optional[str] = None

def get_current_user(request: Request, db: Session = Depends(get_db)):
    authorization = request.headers.get("Authorization")
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    try:
        token = authorization.replace("Bearer ", "")
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = db.query(User).filter(User.id == user_id).first()
    return user

@router.get("/parcels/")
def get_parcels(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    parcels = db.query(Parcel).filter(Parcel.user_id == current_user.id).all()
    return parcels

@router.get("/parcels/{parcel_id}")
def get_parcel(parcel_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    parcel = db.query(Parcel).filter(Parcel.id == parcel_id).first()
    if not parcel:
        raise HTTPException(status_code=404, detail="Parcel not found")
    if parcel.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    return parcel

@router.post("/parcels/")
def create_parcel(parcel_data: ParcelCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Calculate quote based on weight category
    quotes = {'small': 25.50, 'medium': 35.75, 'large': 45.90}
    quote_amount = quotes.get(parcel_data.weight_category, 35.75)
    
    new_parcel = Parcel(
        user_id=current_user.id,
        pickup_address=parcel_data.pickup_address,
        destination_address=parcel_data.destination_address,
        weight_category=parcel_data.weight_category,
        quote_amount=quote_amount,
        pickup_lat=parcel_data.pickup_lat,
        pickup_lng=parcel_data.pickup_lng,
        destination_lat=parcel_data.destination_lat,
        destination_lng=parcel_data.destination_lng,
        status='pending'
    )
    db.add(new_parcel)
    db.commit()
    db.refresh(new_parcel)
    return new_parcel

@router.put("/parcels/{parcel_id}/cancel")
def cancel_parcel(parcel_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    parcel = db.query(Parcel).filter(Parcel.id == parcel_id).first()
    if not parcel:
        raise HTTPException(status_code=404, detail="Parcel not found")
    if parcel.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    parcel.status = 'cancelled'
    db.commit()
    return parcel

@router.put("/parcels/{parcel_id}/destination")
def update_destination(parcel_id: int, update_data: ParcelUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    parcel = db.query(Parcel).filter(Parcel.id == parcel_id).first()
    if not parcel:
        raise HTTPException(status_code=404, detail="Parcel not found")
    if parcel.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    if update_data.destination_address:
        parcel.destination_address = update_data.destination_address
    db.commit()
    db.refresh(parcel)
    return parcel

# Admin endpoints
@router.get("/parcels/all")
def get_all_parcels(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    parcels = db.query(Parcel).all()
    return parcels

@router.put("/parcels/{parcel_id}/admin")
def admin_update_parcel(parcel_id: int, update_data: ParcelUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    parcel = db.query(Parcel).filter(Parcel.id == parcel_id).first()
    if not parcel:
        raise HTTPException(status_code=404, detail="Parcel not found")
    
    if update_data.status:
        parcel.status = update_data.status
    if update_data.present_location:
        parcel.present_location = update_data.present_location
    
    db.commit()
    db.refresh(parcel)
    return parcel
