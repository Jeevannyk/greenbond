Payment backend for Razorpay integration

Setup
1. Create a virtualenv and install dependencies:

   python -m venv .venv
   .venv\Scripts\Activate.ps1
   pip install -r requirements.txt

2. Copy `.env.example` to `.env` and fill your test or live Razorpay keys.

3. Run the server:

   python app.py

Endpoints
- GET /health - basic health check
- POST /create-order - body: { amount: number, currency?: string, receipt?: string } -> creates Razorpay order and returns order and public key
- POST /verify-payment - body: { razorpay_payment_id, razorpay_order_id, razorpay_signature } -> verifies signature

Notes
- This backend is minimal and intended for local testing. Do not use test keys in production.
- For production, secure your keys and use server-side verification and idempotency when creating orders.
