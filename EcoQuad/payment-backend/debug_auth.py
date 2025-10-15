#!/usr/bin/env python3
"""
Debug script to test authentication directly
"""
import sys
import traceback

def test_registration():
    try:
        # Import the app and models
        from app import app, db
        from models import create_models
        
        with app.app_context():
            # Create models
            User, _, _, _ = create_models(db)
            
            # Test creating a user
            print("Testing user creation...")
            
            # Check if user already exists
            existing_user = User.query.filter_by(email='test@example.com').first()
            if existing_user:
                print(f"User already exists: {existing_user.email}")
                return True
            
            # Create new user
            user = User(
                email='test@example.com',
                first_name='Test',
                last_name='User',
                user_type='retail_investor'
            )
            
            # Set password
            user.set_password('testpassword123')
            
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
    print("Debugging authentication...")
    success = test_registration()
    if success:
        print("Registration test passed!")
    else:
        print("Registration test failed!")
        sys.exit(1)
