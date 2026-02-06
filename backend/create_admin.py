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

        # Create regular user
        user = User(
            email="user@deliveroo.com",
            hashed_password=get_password_hash("user123"),
            full_name="Regular User"
        )
        
        db.add(user)
        db.commit()
        print("✅ Regular user created successfully!")
        print("   Email: user@deliveroo.com")
        print("   Password: user123")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_admin_user()
