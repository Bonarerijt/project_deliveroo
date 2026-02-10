#!/usr/bin/env python3
"""Create demo users for testing"""

from app.database.database import SessionLocal, engine, Base
from app.models.user import User
from app.services.auth import get_password_hash

Base.metadata.create_all(bind=engine)

db = SessionLocal()

# Create admin user
admin_email = "admin@deliveroo.com"
admin = db.query(User).filter(User.email == admin_email).first()

if not admin:
    admin = User(
        email=admin_email,
        full_name="Admin User",
        hashed_password=get_password_hash("admin123"),
        is_admin=True,
        is_active=True
    )
    db.add(admin)
    db.commit()
    print(f"✅ Admin user created: {admin_email} / admin123")
else:
    # Update existing admin to ensure is_admin is True
    admin.is_admin = True
    admin.is_active = True
    db.commit()
    print(f"✅ Admin user already exists (updated): {admin_email}")

# Create regular user
user_email = "user@deliveroo.com"
user = db.query(User).filter(User.email == user_email).first()

if not user:
    user = User(
        email=user_email,
        full_name="Demo User",
        hashed_password=get_password_hash("user123"),
        is_admin=False,
        is_active=True
    )
    db.add(user)
    db.commit()
    print(f"✅ Regular user created: {user_email} / user123")
else:
    print(f"✅ Regular user already exists: {user_email}")

db.close()
print("\n✅ Demo users ready!")
