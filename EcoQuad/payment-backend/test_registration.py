#!/usr/bin/env python3
"""
Test registration endpoint directly
"""
import requests
import json

def test_registration():
    url = "http://localhost:5000/api/auth/register"
    data = {
        "email": "newuser@example.com",
        "password": "password123",
        "firstName": "New",
        "lastName": "User", 
        "userType": "retail_investor"
    }
    
    try:
        response = requests.post(url, json=data, headers={"Content-Type": "application/json"})
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 201:
            print("Registration successful!")
            return True
        else:
            print("Registration failed!")
            return False
            
    except Exception as e:
        print(f"Error: {e}")
        return False

if __name__ == "__main__":
    print("Testing registration endpoint...")
    test_registration()
