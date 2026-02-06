def test_create_parcel(client, auth_headers):
    response = client.post(
        "/parcels/",
        json={
            "pickup_address": "123 Start St",
            "destination_address": "456 End Ave",
            "weight_category": "medium"
        },
        headers=auth_headers
    )
    assert response.status_code == 200
    assert response.json()["status"] == "pending"
