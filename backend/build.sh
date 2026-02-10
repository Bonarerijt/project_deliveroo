#!/usr/bin/env bash
set -o errexit

pip install --upgrade pip
pip install -r requirements.txt

# Initialize database tables
python -c "from app.database.database import Base, engine; Base.metadata.create_all(bind=engine)"

# Create admin user
python create_admin.py
