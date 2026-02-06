"""
Tests for parcel endpoints.
"""

import pytest
from app.models.parcel import ParcelStatus


def test_create_parcel(client, test_user, auth_headers):
    """Test creating a new parcel."""
    parcel_data = {
        "pickup_address": "123 Main St, New York, NY",
        "destination_address": "456 Oak Ave, Brooklyn, NY",
        "pickup_lat": 40.7128,
        "pickup_lng": -74.0060,
        "destination_lat": 40.6782,
        "destination_lng": -73.9442,
        "weight_category": "medium",
        "quote_amount": 15.99
    }
    
    response = client.post("/parcels/", json=parcel_data, headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["pickup_address"] == parcel_data["pickup_address"]
    assert data["destination_address"] == parcel_data["destination_address"]
    assert data["status"] == "pending"
    assert "id" in data
    assert "tracking_number" in data


def test_get_parcels(client, test_user, auth_headers):
    """Test getting all parcels for a user."""
    response = client.get("/parcels/", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


def test_get_parcel(client, test_user, auth_headers):
    """Test getting a single parcel by ID."""
    # First create a parcel
    parcel_data = {
        "pickup_address": "123 Main St, New York, NY",
        "destination_address": "456 Oak Ave, Brooklyn, NY",
        "pickup_lat": 40.7128,
        "pickup_lng": -74.0060,
        "destination_lat": 40.6782,
        "destination_lng": -73.9442,
        "weight_category": "small",
        "quote_amount": 10.99
    }
    
    create_response = client.post("/parcels/", json=parcel_data, headers=auth_headers)
    parcel_id = create_response.json()["id"]
    
    # Then get it
    response = client.get(f"/parcels/{parcel_id}", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == parcel_id


def test_update_parcel_status(client, test_user, test_admin, auth_headers):
    """Test updating parcel status (admin only)."""
    # Create a parcel first
    parcel_data = {
        "pickup_address": "123 Main St, New York, NY",
        "destination_address": "456 Oak Ave, Brooklyn, NY",
        "pickup_lat": 40.7128,
        "pickup_lng": -74.0060,
        "destination_lat": 40.6782,
        "destination_lng": -73.9442,
        "weight_category": "large",
        "quote_amount": 25.99
    }
    
    create_response = client.post("/parcels/", json=parcel_data, headers=auth_headers)
    parcel_id = create_response.json()["id"]
    
    # Update status as admin
    admin_token = "admin_token"  # You'd need to get this from auth fixture
    response = client.put(
        f"/admin/parcels/{parcel_id}/status",
        params={"status": "in_transit"},
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "in_transit"

