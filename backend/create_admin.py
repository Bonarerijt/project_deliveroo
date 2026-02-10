from app.database.database import SessionLocal, engine, Base
from app.models.user import User
from app.services.auth import get_password_hash

Base.metadata.create_all(bind=engine)

db = SessionLocal()

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
    print(f"Admin user created: {admin_email} / admin123")
else:
    print("Admin user already exists")

db.close()
