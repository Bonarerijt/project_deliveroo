from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.user import User
from app.models.parcel import Parcel
from app.services.auth import get_current_admin

router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/users")
def get_all_users(db: Session = Depends(get_db), current_admin = Depends(get_current_admin)):
    """Get all users (admin only)"""
    users = db.query(User).all()
    return [{"id": u.id, "email": u.email, "full_name": u.full_name, "is_admin": u.is_admin, "created_at": u.created_at} for u in users]

@router.get("/database-stats")
def get_database_stats(db: Session = Depends(get_db), current_admin = Depends(get_current_admin)):
    """Get database statistics (admin only)"""
    user_count = db.query(User).count()
    parcel_count = db.query(Parcel).count()
    
    return {
        "total_users": user_count,
        "total_parcels": parcel_count,
        "admin_users": db.query(User).filter(User.is_admin == True).count(),
        "pending_parcels": db.query(Parcel).filter(Parcel.status == "pending").count(),
        "delivered_parcels": db.query(Parcel).filter(Parcel.status == "delivered").count(),
    }