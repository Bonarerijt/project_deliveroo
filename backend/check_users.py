#!/usr/bin/env python3
"""Check if admin user exists and has correct permissions"""

from app.database.database import SessionLocal
from app.models.user import User

db = SessionLocal()

# Check admin user
admin = db.query(User).filter(User.email == "admin@deliveroo.com").first()

if admin:
    print(f"✅ Admin user found:")
    print(f"   Email: {admin.email}")
    print(f"   Name: {admin.full_name}")
    print(f"   Is Admin: {admin.is_admin}")
    print(f"   Is Active: {admin.is_active}")
else:
    print("❌ Admin user NOT found in database!")
    print("   Run: python create_admin.py")

# Check regular user
user = db.query(User).filter(User.email == "user@deliveroo.com").first()

if user:
    print(f"\n✅ Regular user found:")
    print(f"   Email: {user.email}")
    print(f"   Name: {user.full_name}")
    print(f"   Is Admin: {user.is_admin}")
    print(f"   Is Active: {user.is_active}")
else:
    print("\n❌ Regular user NOT found")

db.close()
