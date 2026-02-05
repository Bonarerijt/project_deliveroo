from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.user import User
from app.models.parcel import Parcel
from jose import JWTError, jwt
import os

router = APIRouter()

SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"

def get_current_admin(request: Request, db: Session = Depends(get_db)):
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
    if not user or not user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

@router.get("/admin/parcels")
def get_admin_parcels(db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    parcels = db.query(Parcel).all()
    return parcels
