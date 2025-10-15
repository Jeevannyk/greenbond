from flask import Flask, request, jsonify, abort
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
import os
import razorpay
from dotenv import load_dotenv
import logging
import traceback

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('payment-backend')

app = Flask(__name__)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///greenbonds.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-here')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-secret-string')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = False  # Tokens don't expire by default

# Initialize extensions
db = SQLAlchemy()
bcrypt = Bcrypt()
jwt = JWTManager(app)

# Initialize extensions with app
db.init_app(app)
bcrypt.init_app(app)

# allow all origins during development; tighten in production
CORS(app, resources={r"/*": {"origins": "*"}})

RAZORPAY_KEY_ID = os.getenv('RAZORPAY_KEY_ID') or 'rzp_test_key'
RAZORPAY_KEY_SECRET = os.getenv('RAZORPAY_KEY_SECRET') or 'rzp_test_secret'

logger.info('Using Razorpay Key ID: %s', RAZORPAY_KEY_ID)

client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

# Import models and create them
from models import create_models
User, GreenBond, Project, Investment = create_models(db)

# Import and register blueprints after app is created
from auth import auth_bp
app.register_blueprint(auth_bp, url_prefix='/api/auth')


@app.route('/health')
def health():
    return jsonify({'status': 'ok'})


@app.route('/config')
def config():
    # Expose non-secret config for local debugging only
    return jsonify({
        'razorpay_key_id': RAZORPAY_KEY_ID,
        'port': int(os.getenv('PORT', 5000))
    })


@app.route('/create-order', methods=['POST'])
def create_order():
    data = request.json or {}
    amount = data.get('amount')
    currency = data.get('currency', 'INR')
    receipt = data.get('receipt', f'receipt_{os.urandom(6).hex()}')
    if amount is None:
        return jsonify({'error': 'amount is required'}), 400

    try:
        # Razorpay expects amount in paise (i.e., INR * 100)
        amount_in_paise = int(float(amount) * 100)
        logger.info('Creating order for %s paise (currency=%s, receipt=%s)', amount_in_paise, currency, receipt)
        order = client.order.create({'amount': amount_in_paise, 'currency': currency, 'receipt': receipt, 'payment_capture': 1})
        logger.info('Order created: %s', order.get('id') if isinstance(order, dict) else str(order))
        return jsonify({'order': order, 'key': RAZORPAY_KEY_ID})
    except Exception as e:
        tb = traceback.format_exc()
        logger.error('Failed to create order: %s\n%s', str(e), tb)
        # detect authentication errors from Razorpay
        msg = str(e)
        if 'authentication' in msg.lower() or 'invalid key' in msg.lower() or '401' in msg:
            # auth problem - return 401 with helpful message
            return jsonify({'error': 'authentication_failed', 'message': 'Razorpay authentication failed. Check RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your .env and restart the server.'}), 401
        return jsonify({'error': 'failed_to_create_order', 'message': msg}), 500


@app.route('/verify-payment', methods=['POST'])
def verify_payment():
    # This endpoint verifies the signature from the frontend after payment
    data = request.json or {}
    try:
        razorpay_payment_id = data['razorpay_payment_id']
        razorpay_order_id = data['razorpay_order_id']
        razorpay_signature = data['razorpay_signature']
    except KeyError:
        return jsonify({'error': 'missing payment data'}), 400

    # Verify signature
    try:
        params_dict = {
            'razorpay_order_id': razorpay_order_id,
            'razorpay_payment_id': razorpay_payment_id,
            'razorpay_signature': razorpay_signature
        }
        client.utility.verify_payment_signature(params_dict)
        # At this point you would record payment in your DB and fulfill the order
        return jsonify({'status': 'verified'})
    except Exception as e:
        return jsonify({'error': 'verification failed', 'details': str(e)}), 400


# Create database tables
def create_tables():
    with app.app_context():
        db.create_all()
        logger.info('Database tables created')

if __name__ == '__main__':
    create_tables()
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
