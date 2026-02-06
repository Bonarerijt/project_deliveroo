import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app.models.user import User
from app.services.auth import get_password_hash

def test_register_user(client: TestClient, db: Session):
    """Test user registration."""
    user_data = {
        "email": "test@example.com",
        "full_name": "Test User",
        "password": "testpassword"
    }

    response = client.post("/auth/register", json=user_data)
    assert response.status_code == 200

    data = response.json()
    assert data["email"] == user_data["email"]
    assert data["full_name"] == user_data["full_name"]
    assert "id" in data
    assert data["is_active"] is True
    assert data["is_admin"] is False

    # Check user was created in database
    user = db.query(User).filter(User.email == user_data["email"]).first()
    assert user is not None
    assert user.full_name == user_data["full_name"]

def test_register_duplicate_email(client: TestClient):
    """Test registering with an existing email."""
    user_data = {
        "email": "duplicate@example.com",
        "full_name": "Test User",
        "password": "testpassword"
    }

    # Register first time
    response = client.post("/auth/register", json=user_data)
    assert response.status_code == 200

    # Try to register again with same email
    response = client.post("/auth/register", json=user_data)
    assert response.status_code == 400
    assert "Email already registered" in response.json()["detail"]

def test_login_success(client: TestClient):
    """Test successful login."""
    user_data = {
        "email": "login@example.com",
        "full_name": "Login User",
        "password": "testpassword"
    }

    # Register user first
    client.post("/auth/register", json=user_data)

    # Login
    login_data = {
        "username": user_data["email"],
        "password": user_data["password"]
    }

    response = client.post("/auth/login", data=login_data)
    assert response.status_code == 200

    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_wrong_password(client: TestClient):
    """Test login with wrong password."""
    user_data = {
        "email": "wrongpass@example.com",
        "full_name": "Wrong Pass User",
        "password": "correctpassword"
    }

    # Register user first
    client.post("/auth/register", json=user_data)

    # Try login with wrong password
    login_data = {
        "username": user_data["email"],
        "password": "wrongpassword"
    }

    response = client.post("/auth/login", data=login_data)
    assert response.status_code == 401
    assert "Incorrect email or password" in response.json()["detail"]

def test_login_inactive_user(client: TestClient, db: Session):
    """Test login with inactive user."""
    user_data = {
        "email": "inactive@example.com",
        "full_name": "Inactive User",
        "password": "testpassword"
    }

    # Register user
    client.post("/auth/register", json=user_data)

    # Deactivate user
    user = db.query(User).filter(User.email == user_data["email"]).first()
    user.is_active = False
    db.commit()

    # Try login
    login_data = {
        "username": user_data["email"],
        "password": user_data["password"]
    }

    response = client.post("/auth/login", data=login_data)
    assert response.status_code == 400
    assert "Inactive user" in response.json()["detail"]
