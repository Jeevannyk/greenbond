# Green Bonds Platform

A comprehensive platform for green bond investments with database authentication and payment processing.

## Features

- **User Authentication**: Secure signin/signout with JWT tokens
- **Database Integration**: SQLite database with user management
- **Payment Processing**: Razorpay integration for bond investments
- **User Types**: Support for investors, bond issuers, and project managers
- **Real-time Dashboard**: Track investments, bonds, and impact metrics

## Tech Stack

### Backend
- **Flask**: Python web framework
- **SQLAlchemy**: Database ORM
- **Flask-JWT-Extended**: JWT authentication
- **Flask-Bcrypt**: Password hashing
- **Razorpay**: Payment processing

### Frontend
- **React**: UI framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Shadcn/ui**: Component library
- **React Router**: Navigation

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd payment-backend
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Create a `.env` file with the following variables:
   ```
   DATABASE_URL=sqlite:///greenbonds.db
   SECRET_KEY=your-secret-key-here
   JWT_SECRET_KEY=jwt-secret-string
   RAZORPAY_KEY_ID=your-razorpay-key-id
   RAZORPAY_KEY_SECRET=your-razorpay-key-secret
   PORT=5000
   ```

4. Run the backend server:
   ```bash
   python app.py
   ```

The backend will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd shadcn-ui
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/verify-token` - Verify JWT token

### Payment
- `POST /create-order` - Create Razorpay order
- `POST /verify-payment` - Verify payment signature

## Database Schema

### Users Table
- `id`: Primary key (UUID)
- `email`: Unique email address
- `password_hash`: Hashed password
- `first_name`: User's first name
- `last_name`: User's last name
- `user_type`: Type of user (investor, issuer, etc.)
- `company_name`: Company name (optional)
- `kyc_status`: KYC verification status
- `is_active`: Account status
- `created_at`: Account creation timestamp
- `updated_at`: Last update timestamp

### Green Bonds Table
- `id`: Primary key (UUID)
- `issuer_id`: Foreign key to users table
- `bond_name`: Name of the bond
- `isin`: International Securities Identification Number
- `bond_type`: Type of bond (corporate, sovereign, etc.)
- `face_value`: Face value of the bond
- `coupon_rate`: Interest rate
- `maturity_date`: Bond maturity date
- `issue_date`: Bond issue date
- `currency`: Currency code
- `minimum_investment`: Minimum investment amount
- `total_amount`: Total bond amount
- `amount_raised`: Amount raised so far
- `risk_rating`: Risk rating
- `status`: Bond status
- `description`: Bond description

### Projects Table
- `id`: Primary key (UUID)
- `bond_id`: Foreign key to green_bonds table
- `project_name`: Name of the project
- `project_type`: Type of project
- `description`: Project description
- `country`: Project country
- `region`: Project region
- `project_manager`: Project manager name
- `start_date`: Project start date
- `expected_completion_date`: Expected completion date
- `total_budget`: Total project budget
- `allocated_funds`: Funds allocated to project
- `spent_funds`: Funds spent on project
- `status`: Project status

### Investments Table
- `id`: Primary key (UUID)
- `investor_id`: Foreign key to users table
- `bond_id`: Foreign key to green_bonds table
- `investment_amount`: Amount invested
- `purchase_price`: Price per bond
- `purchase_date`: Investment date
- `status`: Investment status
- `transaction_id`: Payment transaction ID
- `fees`: Transaction fees
- `expected_return`: Expected return amount
- `maturity_value`: Maturity value

## User Types

1. **Retail Investor**: Individual investors
2. **Institutional Investor**: Organizations and funds
3. **Bond Issuer**: Companies issuing green bonds
4. **Project Manager**: Managing green projects
5. **Regulator**: Regulatory oversight

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected routes
- CORS configuration
- Input validation
- SQL injection protection

## Development

### Running Tests
```bash
# Backend tests
cd payment-backend
python -m pytest

# Frontend tests
cd shadcn-ui
npm test
```

### Database Migrations
The database tables are created automatically when the Flask app starts. For production, consider using Flask-Migrate for proper database migrations.

## Deployment

### Backend Deployment
1. Set up a production database (PostgreSQL recommended)
2. Configure environment variables
3. Use a WSGI server like Gunicorn
4. Set up reverse proxy with Nginx

### Frontend Deployment
1. Build the production bundle:
   ```bash
   npm run build
   ```
2. Deploy to a static hosting service or CDN

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.