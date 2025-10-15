#!/usr/bin/env python3
"""
Debug signin/signout functionality
"""
import requests
import json

def test_signin():
    """Test signin endpoint"""
    print("Testing signin...")
    
    # First, let's try to register a new user
    register_data = {
        "email": "signintest@example.com",
        "password": "password123",
        "firstName": "Signin",
        "lastName": "Test",
        "userType": "retail_investor"
    }
    
    try:
        # Try registration first
        register_response = requests.post(
            "http://localhost:5000/api/auth/register",
            json=register_data,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Registration Status: {register_response.status_code}")
        if register_response.status_code == 201:
            print("User registered successfully")
        elif register_response.status_code == 409:
            print("User already exists (this is fine)")
        else:
            print(f"Registration failed: {register_response.text}")
            return None
        
        # Now test signin
        signin_data = {
            "email": "signintest@example.com",
            "password": "password123"
        }
        
        signin_response = requests.post(
            "http://localhost:5000/api/auth/login",
            json=signin_data,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Signin Status: {signin_response.status_code}")
        print(f"Signin Response: {signin_response.text}")
        
        if signin_response.status_code == 200:
            data = signin_response.json()
            token = data.get('access_token')
            user = data.get('user')
            print(f"Signin successful! Token: {token[:20]}...")
            print(f"User: {user.get('email') if user else 'No user data'}")
            return token
        else:
            print("Signin failed!")
            return None
            
    except Exception as e:
        print(f"Error during signin test: {e}")
        return None

def test_profile(token):
    """Test profile endpoint with token"""
    print("\nTesting profile with token...")
    
    try:
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        
        response = requests.get("http://localhost:5000/api/auth/profile", headers=headers)
        
        print(f"Profile Status: {response.status_code}")
        print(f"Profile Response: {response.text}")
        
        if response.status_code == 200:
            print("Profile test successful!")
            return True
        else:
            print("Profile test failed!")
            return False
            
    except Exception as e:
        print(f"Error during profile test: {e}")
        return False

def test_logout(token):
    """Test logout endpoint"""
    print("\nTesting logout...")
    
    try:
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        
        response = requests.post("http://localhost:5000/api/auth/logout", headers=headers)
        
        print(f"Logout Status: {response.status_code}")
        print(f"Logout Response: {response.text}")
        
        if response.status_code == 200:
            print("Logout successful!")
            return True
        else:
            print("Logout failed!")
            return False
            
    except Exception as e:
        print(f"Error during logout test: {e}")
        return False

def test_token_verification(token):
    """Test token verification"""
    print("\nTesting token verification...")
    
    try:
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        
        response = requests.post("http://localhost:5000/api/auth/verify-token", headers=headers)
        
        print(f"Token Verification Status: {response.status_code}")
        print(f"Token Verification Response: {response.text}")
        
        if response.status_code == 200:
            print("Token verification successful!")
            return True
        else:
            print("Token verification failed!")
            return False
            
    except Exception as e:
        print(f"Error during token verification test: {e}")
        return False

if __name__ == "__main__":
    print("=" * 60)
    print("DEBUGGING SIGNIN/SIGNOUT FUNCTIONALITY")
    print("=" * 60)
    
    # Test signin
    token = test_signin()
    
    if token:
        print("\n✅ Signin successful!")
        
        # Test profile
        if test_profile(token):
            print("✅ Profile test successful!")
        else:
            print("❌ Profile test failed!")
        
        # Test token verification
        if test_token_verification(token):
            print("✅ Token verification successful!")
        else:
            print("❌ Token verification failed!")
        
        # Test logout
        if test_logout(token):
            print("✅ Logout successful!")
        else:
            print("❌ Logout failed!")
        
        print("\n" + "=" * 60)
        print("SIGNIN/SIGNOUT DEBUG COMPLETE")
        print("=" * 60)
    else:
        print("\n❌ Signin failed - cannot proceed with other tests")
        print("=" * 60)
