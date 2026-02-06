import requests
import json

# Test backend authentication
def test_auth():
    base_url = "http://localhost:8000"
    
    print("Testing Deliveroo Backend Authentication...")

    # Test health endpoint
    try:
        response = requests.get(f"{base_url}/health")
        if response.status_code == 200:
            print("✅ Health check passed")
        else:
            print("❌ Health check failed")
            return
    except Exception as e:
        print(f"❌ Cannot connect to backend: {e}")
        return
    
    # Test login with admin credentials
    try:
        login_data = {
            'username': 'admin@deliveroo.com',
            'password': 'admin123'
        }
        
        response = requests.post(
            f"{base_url}/auth/login",
            data=login_data,
            headers={'Content-Type': 'application/x-www-form-urlencoded'}
        )
        
        if response.status_code == 200:
            data = response.json()
            if 'access_token' in data:
                print("✅ Admin login successful")
                token = data['access_token']
                
                # Test protected endpoint
                headers = {'Authorization': f'Bearer {token}'}
                parcels_response = requests.get(f"{base_url}/parcels/", headers=headers)
                
                if parcels_response.status_code == 200:
                    print("✅ Protected endpoint access successful")
                    parcels = parcels_response.json()
                    print(f"📦 Found {len(parcels)} parcels")
                else:
                    print("❌ Protected endpoint access failed")
            else:
                print("❌ No access token in response")
        else:
            print(f"❌ Login failed: {response.status_code} - {response.text}")
            
    except Exception as e:
        print(f"❌ Login test failed: {e}")
    
     # Test user registration
    try:
        register_data = {
            'email': 'test@example.com',
            'password': 'testpass123',
            'full_name': 'Test User'
        }
        
        response = requests.post(
            f"{base_url}/auth/register",
            json=register_data,
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 200:
            print("✅ User registration successful")
        elif response.status_code == 400 and 'already registered' in response.text:
            print("✅ User registration validation working (user exists)")
        else:
            print(f"❌ Registration failed: {response.status_code} - {response.text}")
            
    except Exception as e:
        print(f"❌ Registration test failed: {e}")

if __name__ == "__main__":
    test_auth()
    
