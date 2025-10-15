#!/usr/bin/env python3
"""
Simple test script to verify authentication endpoints are working
"""
import requests
import json

BASE_URL = "http://localhost:5000"

def test_health():
    """Test health endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"Health check: {response.status_code} - {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Health check failed: {e}")
        return False

def test_register():
    """Test user registration"""
    try:
        user_data = {
            "email": "test@example.com",
            "password": "testpassword123",
            "firstName": "Test",
            "lastName": "User",
            "userType": "retail_investor"
        }
        
        response = requests.post(
            f"{BASE_URL}/api/auth/register",
            json=user_data,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Registration: {response.status_code}")
        if response.status_code == 201:
            data = response.json()
            print(f"User created: {data.get('user', {}).get('email')}")
            return data.get('access_token')
        else:
            print(f"Registration failed: {response.text}")
            return None
            
    except Exception as e:
        print(f"Registration test failed: {e}")
        return None

def test_login():
    """Test user login"""
    try:
        login_data = {
            "email": "test@example.com",
            "password": "testpassword123"
        }
        
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json=login_data,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Login: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Login successful: {data.get('user', {}).get('email')}")
            return data.get('access_token')
        else:
            print(f"Login failed: {response.text}")
            return None
            
    except Exception as e:
        print(f"Login test failed: {e}")
        return None

def test_profile(token):
    """Test profile endpoint with token"""
    try:
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        
        response = requests.get(f"{BASE_URL}/api/auth/profile", headers=headers)
        
        print(f"Profile: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Profile data: {data.get('user', {}).get('email')}")
            return True
        else:
            print(f"Profile failed: {response.text}")
            return False
            
    except Exception as e:
        print(f"Profile test failed: {e}")
        return False

if __name__ == "__main__":
    print("Testing Green Bonds Authentication API...")
    print("=" * 50)
    
    # Test health endpoint
    if not test_health():
        print("Health check failed - is the server running?")
        exit(1)
    
    print("Health check passed")
    
    # Test registration
    token = test_register()
    if token:
        print("Registration passed")
    else:
        print("Registration failed")
        # Try login instead (user might already exist)
        token = test_login()
        if token:
            print("Login passed (user already exists)")
        else:
            print("Both registration and login failed")
            exit(1)
    
    # Test profile with token
    if test_profile(token):
        print("Profile test passed")
    else:
        print("Profile test failed")
        exit(1)
    
    print("=" * 50)
    print("All authentication tests passed!")
    print("The backend is working correctly.")
