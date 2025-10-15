#!/usr/bin/env python3
"""
Simple test to debug registration issue
"""
import requests
import json

def test_endpoints():
    print("Testing endpoints...")
    
    # Test health endpoint
    try:
        response = requests.get("http://localhost:5000/health")
        print(f"Health endpoint: {response.status_code} - {response.json()}")
    except Exception as e:
        print(f"Health endpoint error: {e}")
        return
    
    # Test config endpoint
    try:
        response = requests.get("http://localhost:5000/config")
        print(f"Config endpoint: {response.status_code} - {response.json()}")
    except Exception as e:
        print(f"Config endpoint error: {e}")
    
    # Test registration endpoint
    try:
        data = {
            "email": "simple@example.com",
            "password": "password123",
            "firstName": "Simple",
            "lastName": "Test",
            "userType": "retail_investor"
        }
        
        response = requests.post(
            "http://localhost:5000/api/auth/register",
            json=data,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Registration endpoint: {response.status_code}")
        print(f"Registration response: {response.text}")
        
    except Exception as e:
        print(f"Registration endpoint error: {e}")

if __name__ == "__main__":
    test_endpoints()
