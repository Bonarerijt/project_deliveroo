#!/usr/bin/env python3
"""
Create Admin Script
This script creates an admin user in the database.
Run this script to set up the initial admin account.
"""

from sqlalchemy.orm import Session
from app.database.database import engine, get_db
from app.models.user import User
from app.services.auth import get_password_hash


def create_admin_user(db: Session, email: str, username: str, password: str):
    """Create an admin user if it doesn't exist."""
    
    # Check if admin already exists
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        print(f"Admin user with email {email} already exists.")
        return existing_user
    
    # Create new admin user
    admin_user = User(
        email=email,
        username=username,
        hashed_password=get_password_hash(password),
        is_admin=True,
        is_active=True
    )
    
    db.add(admin_user)
    db.commit()
    db.refresh(admin_user)
    
    print(f"Admin user {username} created successfully!")
    return admin_user


def main():
    """Main function to create admin user."""
    # Import models to create tables
    from app.models.user import Base
    from app.models.parcel import Base as ParcelBase
    
    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)
    ParcelBase.metadata.create_all(bind=engine)
    
    # Get database session
    db = next(get_db())
    
    try:
        # Create admin user with default credentials
        # Change these values for production!
        ADMIN_EMAIL = "admin@deliveroo.com"
        ADMIN_USERNAME = "admin"
        ADMIN_PASSWORD = "admin123"  # Change this in production!
        
        create_admin_user(db, ADMIN_EMAIL, ADMIN_USERNAME, ADMIN_PASSWORD)
        print("Admin user setup complete!")
        
    finally:
        db.close()


if __name__ == "__main__":
    main()

