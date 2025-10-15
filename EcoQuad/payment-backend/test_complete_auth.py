#!/usr/bin/env python3
"""
Test complete authentication flow
"""
import requests
import json

def test_complete_auth():
    print("Testing complete authentication flow...")
    print("=" * 50)
    
    # Test 1: Registration
    print("1. Testing Registration...")
    register_data = {
        "email": "completetest@example.com",
        "password": "password123",
        "firstName": "Complete",
        "lastName": "Test",
        "userType": "retail_investor"
    }
    
    try:
        response = requests.post(
            "http://localhost:5000/api/auth/register",
            json=register_data,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Registration Status: {response.status_code}")
        if response.status_code == 201:
            data = response.json()
            token = data.get('access_token')
            user = data.get('user')
            print(f"Registration successful! User: {user.get('email')}")
            print(f"Token: {token[:20]}...")
        elif response.status_code == 409:
            print("User already exists, proceeding to login...")
            token = None
        else:
            print(f"Registration failed: {response.text}")
            return False
    except Exception as e:
        print(f"Registration error: {e}")
        return False
    
    # Test 2: Login (if registration failed or user exists)
    if not token:
        print("\n2. Testing Login...")
        login_data = {
            "email": "completetest@example.com",
            "password": "password123"
        }
        
        try:
            response = requests.post(
                "http://localhost:5000/api/auth/login",
                json=login_data,
                headers={"Content-Type": "application/json"}
            )
            
            print(f"Login Status: {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                token = data.get('access_token')
                user = data.get('user')
                print(f"Login successful! User: {user.get('email')}")
                print(f"Token: {token[:20]}...")
            else:
                print(f"Login failed: {response.text}")
                return False
        except Exception as e:
            print(f"Login error: {e}")
            return False
    
    # Test 3: Profile with token
    print("\n3. Testing Profile...")
    try:
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        
        response = requests.get("http://localhost:5000/api/auth/profile", headers=headers)
        
        print(f"Profile Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            user = data.get('user')
            print(f"Profile successful! User: {user.get('email')}")
        else:
            print(f"Profile failed: {response.text}")
            return False
    except Exception as e:
        print(f"Profile error: {e}")
        return False
    
    # Test 4: Token verification
    print("\n4. Testing Token Verification...")
    try:
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        
        response = requests.post("http://localhost:5000/api/auth/verify-token", headers=headers)
        
        print(f"Token Verification Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Token verification successful! Valid: {data.get('valid')}")
        else:
            print(f"Token verification failed: {response.text}")
            return False
    except Exception as e:
        print(f"Token verification error: {e}")
        return False
    
    # Test 5: Logout
    print("\n5. Testing Logout...")
    try:
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        
        response = requests.post("http://localhost:5000/api/auth/logout", headers=headers)
        
        print(f"Logout Status: {response.status_code}")
        if response.status_code == 200:
            print("Logout successful!")
        else:
            print(f"Logout failed: {response.text}")
            return False
    except Exception as e:
        print(f"Logout error: {e}")
        return False
    
    print("\n" + "=" * 50)
    print("All authentication tests passed!")
    print("=" * 50)
    return True

if __name__ == "__main__":
    test_complete_auth()
