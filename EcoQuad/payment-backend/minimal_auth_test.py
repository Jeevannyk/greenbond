#!/usr/bin/env python3
"""
Minimal test to debug auth endpoint
"""
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token
from datetime import timedelta
import os

# Create minimal Flask app
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test_greenbonds.db'
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

@app.route('/test-register', methods=['POST'])
def test_register():
    """Test registration endpoint"""
    try:
        data = request.get_json()
        print(f"Received data: {data}")
        
        # Validate required fields
        required_fields = ['email', 'password', 'firstName', 'lastName', 'userType']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Check if user already exists
        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user:
            return jsonify({'error': 'User with this email already exists'}), 409
        
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
        
        # Create access token
        access_token = create_access_token(
            identity=user.id,
            expires_delta=timedelta(hours=24)
        )
        
        return jsonify({
            'message': 'User registered successfully',
            'access_token': access_token,
            'user': user.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"Registration error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': 'Registration failed', 'details': str(e)}), 500

@app.route('/test-health')
def test_health():
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        print("Database tables created")
    
    print("Starting minimal auth test server...")
    app.run(host='0.0.0.0', port=5001, debug=True)
