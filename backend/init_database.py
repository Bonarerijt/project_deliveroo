#!/usr/bin/env python3
"""
Script to initialize the database by creating all tables.
"""

from app.database.database import engine, Base

def init_database():
    """Create all database tables."""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Database initialized successfully!")

if __name__ == "__main__":
    init_database()
