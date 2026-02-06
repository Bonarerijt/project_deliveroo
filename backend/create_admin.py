import sys
import os
from sqlalchemy.orm import Session
from app.database.database import SessionLocal
from app.models.user import User
from app.services.auth import get_password_hash

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def create_admin_user():
    db = SessionLocal()
    try:
        # Check if admin already exists
        admin = db.query(User).filter(User.email == "admin@deliveroo.com").first()
        
        if admin:
            print("Admin user already exists")
            return
        
        # Create admin user
        admin = User(
            email="admin@deliveroo.com",
            hashed_password=get_password_hash("admin123"),
            full_name="Administrator",
            is_admin=True
        )

        db.add(admin)
        db.commit()
        print("✅ Admin user created successfully!")
        print("   Email: admin@deliveroo.com")
        print("   Password: admin123")