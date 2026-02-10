#!/usr/bin/env python3
from app.database.database import engine, Base, SessionLocal
from app.models.user import User
from app.services.auth import get_password_hash

print("Creating database tables...")
Base.metadata.create_all(bind=engine)
print("Database initialized successfully!")

print("Creating admin user...")
db = SessionLocal()
try:
    admin = db.query(User).filter(User.email == "admin@deliveroo.com").first()
    if not admin:
        admin = User(
            email="admin@deliveroo.com",
            full_name="Admin User",
            hashed_password=get_password_hash("admin123"),
            is_admin=True,
            is_active=True
        )
        db.add(admin)
        db.commit()
        print("✅ Admin created: admin@deliveroo.com / admin123")
    else:
        print("✅ Admin already exists: admin@deliveroo.com / admin123")
finally:
    db.close()
