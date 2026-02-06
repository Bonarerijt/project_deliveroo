import sys
import os
from sqlalchemy.orm import Session
from app.database.database import SessionLocal
from app.models.user import User
from app.services.auth import get_password_hash

sys.path.append(os.path.dirname(os.path.abspath(__file__)))