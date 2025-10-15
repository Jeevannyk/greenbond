#!/usr/bin/env python3
"""
Debug registration directly in the app context
"""
import sys
import traceback
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token
from datetime import timedelta
import os

# Create a minimal Flask app for testing
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///greenbonds.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'test-secret'
app.config['JWT_SECRET_KEY'] = 'jwt-secret'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = False

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# Import and create models
from models import create_models
User, _, _, _ = create_models(db)

def test_registration():
    try:
        with app.app_context():
            # Create tables
            db.create_all()
            
            # Test data
            data = {
                "email": "debug@example.com",
                "password": "password123",
                "firstName": "Debug",
                "lastName": "User",
                "userType": "retail_investor"
            }
            
            print("Testing registration with data:", data)
            
            # Validate required fields
            required_fields = ['email', 'password', 'firstName', 'lastName', 'userType']
            for field in required_fields:
                if not data.get(field):
                    print(f"Missing field: {field}")
                    return False
            
            # Check if user already exists
            existing_user = User.query.filter_by(email=data['email']).first()
            if existing_user:
                print(f"User already exists: {existing_user.email}")
                return True
            
            # Create new user
            user = User(
                email=data['email'],
                first_name=data['firstName'],
                last_name=data['lastName'],
                user_type=data['userType'],
                company_name=data.get('companyName')
            )
            
            # Set password
            user.set_password(data['password'])
            
            # Save to database
            db.session.add(user)
            db.session.commit()
            
            print(f"User created successfully: {user.email}")
            return True
            
    except Exception as e:
        print(f"Error: {e}")
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("Debugging registration...")
    success = test_registration()
    if success:
        print("Registration debug passed!")
    else:
        print("Registration debug failed!")
        sys.exit(1)
