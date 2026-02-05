from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database.database import get_db
from app.models.parcel import Parcel
from app.models.user import User
from app.schemas.parcel import (
    ParcelCreate, ParcelResponse, ParcelUpdate, MapRoute
)
from app.services.auth import get_current_user, get_current_admin
from app.services.maps import maps_service
from app.services.email import email_service

router = APIRouter(prefix="/parcels", tags=["parcels"])

@router.post("/", response_model=ParcelResponse)
def create_parcel(
    parcel: ParcelCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Calculate distance and duration
    origin = (parcel.pickup_lat, parcel.pickup_lng)
    destination = (parcel.destination_lat, parcel.destination_lng)

    distance_info = maps_service.calculate_distance_matrix(origin, destination)

    if not distance_info:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not calculate route information"
        )
    
    distance_km = distance_info['distance']['value'] / 1000  # Convert to kilometers
    duration_mins = int(distance_info['duration']['value'] / 60)  # Convert to minutes as an integer

    # Calculate quote
    quote_amount = maps_service.calculate_quote(parcel.weight_category, distance_km)

    # Create parcel
    db_parcel = Parcel(
        user_id=current_user.id,
        pickup_address=parcel.pickup_address,
        destination_address=parcel.destination_address,
        pickup_lat=parcel.pickup_lat,
        pickup_lng=parcel.pickup_lng,
        destination_lat=parcel.destination_lat,
        destination_lng=parcel.destination_lng,
        weight_category=parcel.weight_category,
        quote_amount=quote_amount,
        distance_km=distance_km,
        duration_mins=duration_mins
    )

    db.add(db_parcel)
    db.commit()
    db.refresh(db_parcel)
    return db_parcel


@router.get("/")
def get_user_parcels(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    parcels = db.query(Parcel).filter(Parcel.user_id == current_user.id).all()

    # Converted to dict format to handle serialization
    result = []
    for parcel in parcels:
        result.append({
            "id": parcel.id,
            "user_id": parcel.user_id,
            "pickup_address": parcel.pickup_address,
            "destination_address": parcel.destination_address,
            "pickup_lat": parcel.pickup_lat,
            "pickup_lng": parcel.pickup_lng,
            "destination_lat": parcel.destination_lat,
            "destination_lng": parcel.destination_lng,
            "weight_category": parcel.weight_category.value if hasattr(parcel.weight_category, 'value') else str(parcel.weight_category),
            "quote_amount": parcel.quote_amount,
            "status": parcel.status.value if hasattr(parcel.status, 'value') else str(parcel.status),
            "present_location": parcel.present_location,
            "distance_km": parcel.distance_km,
            "duration_mins": parcel.duration_mins,
            "created_at": parcel.created_at.isoformat() if parcel.created_at else None,
            "updated_at": parcel.updated_at.isoformat() if parcel.updated_at else None
        })
    
    return result

# Simplifying the admin endpoint to return basic parcel info only
@router.get("/all")
def get_all_parcels(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Admin endpoint to get all parcels"""
    parcels = db.query(Parcel).all()
    return parcels


@router.get("/{parcel_id}", response_model=ParcelResponse)
def get_parcel(
    parcel_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    parcel = db.query(Parcel).filter(Parcel.id == parcel_id).first()
    
    if not parcel:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Parcel not found"
        )
    
    # Users can only see their own parcels unless they're admin
    if parcel.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this parcel"
        )
    
    return parcel

@router.put("/{parcel_id}/destination", response_model=ParcelResponse)
def update_parcel_destination(
    parcel_id: int,
    update_data: ParcelUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    parcel = db.query(Parcel).filter(Parcel.id == parcel_id).first()
    
    if not parcel:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Parcel not found"
        )
    
    # Only parcel owner can update destination
    if parcel.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this parcel"
        )
    
    # Can't update if already delivered or cancelled
    if parcel.status in ['delivered', 'cancelled']:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot update parcel with status: {parcel.status}"
        )
    
    # Update destination if provided
    if update_data.destination_address:
        parcel.destination_address = update_data.destination_address
    
    if update_data.destination_lat and update_data.destination_lng:
        parcel.destination_lat = update_data.destination_lat
        parcel.destination_lng = update_data.destination_lng
        
        # Recalculate distance and quote
        origin = (parcel.pickup_lat, parcel.pickup_lng)
        destination = (parcel.destination_lat, parcel.destination_lng)
        
        distance_info = maps_service.calculate_distance_matrix(origin, destination)
        if distance_info:
            parcel.distance_km = distance_info['distance']['value'] / 1000
            parcel.duration_mins = int(distance_info['duration']['value'] / 60)  # Convert to integer
            parcel.quote_amount = maps_service.calculate_quote(
                parcel.weight_category, parcel.distance_km
            )
    
    db.commit()
    db.refresh(parcel)
    return parcel


@router.put("/{parcel_id}/cancel", response_model=ParcelResponse)
def cancel_parcel(
    parcel_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    parcel = db.query(Parcel).filter(Parcel.id == parcel_id).first()
    
    if not parcel:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Parcel not found"
        )
    
    # Only parcel owner can cancel
    if parcel.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to cancel this parcel"
        )
    
    # Can't cancel if already delivered
    if parcel.status == 'delivered':
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot cancel delivered parcel"
        )
    
    parcel.status = 'cancelled'
    db.commit()
    db.refresh(parcel)
    return parcel

@router.put("/{parcel_id}/admin", response_model=ParcelResponse)
def admin_update_parcel(
    parcel_id: int,
    update_data: ParcelUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    parcel = db.query(Parcel).filter(Parcel.id == parcel_id).first()
    
    if not parcel:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Parcel not found"
        )
    
    # Store old values for email notifications
    old_status = parcel.status
    old_location = parcel.present_location
    
    # Update status if provided
    if update_data.status:
        parcel.status = update_data.status
    
    # Update present location if provided
    if update_data.present_location:
        parcel.present_location = update_data.present_location
    
    db.commit()
    db.refresh(parcel)
    
    # Send email notifications if values changed
    user = db.query(User).filter(User.id == parcel.user_id).first()
    
    if update_data.status and update_data.status != old_status:
        email_service.send_status_update(user.email, parcel.id, update_data.status)
    
    if (update_data.present_location and 
        update_data.present_location != old_location):
        email_service.send_location_update(user.email, parcel.id, update_data.present_location)
    
    return parcel


@router.get("/{parcel_id}/route", response_model=MapRoute)
def get_parcel_route(
    parcel_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    parcel = db.query(Parcel).filter(Parcel.id == parcel_id).first()
    
    if not parcel:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Parcel not found"
        )
    
    # Users can only see their own routes unless they're admin
    if parcel.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this route"
        )
    
    origin = (parcel.pickup_lat, parcel.pickup_lng)
    destination = (parcel.destination_lat, parcel.destination_lng)
    
    distance_info = maps_service.calculate_distance_matrix(origin, destination)
    polyline = maps_service.get_route_polyline(origin, destination)
    
    if not distance_info:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not calculate route"
        )
    
    return {
        "distance": distance_info['distance']['text'],
        "duration": distance_info['duration']['text'],
        "polyline": polyline or ""
    }