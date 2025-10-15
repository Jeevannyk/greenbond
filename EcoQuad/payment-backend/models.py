from datetime import datetime
import uuid

# Global registry to store models once they're created
_models_created = False
_User = None
_GreenBond = None
_Project = None
_Investment = None

def create_models(db):
    """Create all database models with the provided db instance"""
    global _models_created, _User, _GreenBond, _Project, _Investment
    
    if _models_created:
        return _User, _GreenBond, _Project, _Investment
    
    class User(db.Model):
        __tablename__ = 'users'
        
        id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
        email = db.Column(db.String(120), unique=True, nullable=False, index=True)
        password_hash = db.Column(db.String(128), nullable=False)
        first_name = db.Column(db.String(50), nullable=False)
        last_name = db.Column(db.String(50), nullable=False)
        user_type = db.Column(db.String(50), nullable=False)
        company_name = db.Column(db.String(100), nullable=True)
        kyc_status = db.Column(db.String(20), default='pending')
        is_active = db.Column(db.Boolean, default=True)
        created_at = db.Column(db.DateTime, default=datetime.utcnow)
        updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
        
        # Relationships
        investments = db.relationship('Investment', backref='investor', lazy=True)
        issued_bonds = db.relationship('GreenBond', backref='issuer', lazy=True)
        
        def set_password(self, password):
            """Hash and set password"""
            from flask_bcrypt import Bcrypt
            bcrypt = Bcrypt()
            self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
        
        def check_password(self, password):
            """Check if provided password matches hash"""
            from flask_bcrypt import Bcrypt
            bcrypt = Bcrypt()
            return bcrypt.check_password_hash(self.password_hash, password)
        
        def to_dict(self):
            """Convert user to dictionary for JSON serialization"""
            return {
                'id': self.id,
                'email': self.email,
                'firstName': self.first_name,
                'lastName': self.last_name,
                'userType': self.user_type,
                'companyName': self.company_name,
                'kycStatus': self.kyc_status,
                'isActive': self.is_active,
                'createdAt': self.created_at.isoformat(),
                'preferences': {
                    'currency': 'INR',
                    'language': 'en',
                    'notifications': True
                }
            }

    class GreenBond(db.Model):
        __tablename__ = 'green_bonds'
        
        id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
        issuer_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
        bond_name = db.Column(db.String(200), nullable=False)
        isin = db.Column(db.String(20), unique=True, nullable=False)
        bond_type = db.Column(db.String(50), nullable=False)
        face_value = db.Column(db.Float, nullable=False)
        coupon_rate = db.Column(db.Float, nullable=False)
        maturity_date = db.Column(db.Date, nullable=False)
        issue_date = db.Column(db.Date, nullable=False)
        currency = db.Column(db.String(3), default='INR')
        minimum_investment = db.Column(db.Float, nullable=False)
        total_amount = db.Column(db.Float, nullable=False)
        amount_raised = db.Column(db.Float, default=0)
        risk_rating = db.Column(db.String(10), nullable=False)
        status = db.Column(db.String(20), default='draft')
        description = db.Column(db.Text, nullable=False)
        created_at = db.Column(db.DateTime, default=datetime.utcnow)
        
        # Relationships
        investments = db.relationship('Investment', backref='bond', lazy=True)
        projects = db.relationship('Project', backref='bond', lazy=True)
        
        def to_dict(self):
            """Convert bond to dictionary for JSON serialization"""
            return {
                'id': self.id,
                'issuerId': self.issuer_id,
                'issuerName': self.issuer.first_name + ' ' + self.issuer.last_name if self.issuer else 'Unknown',
                'bondName': self.bond_name,
                'isin': self.isin,
                'bondType': self.bond_type,
                'faceValue': self.face_value,
                'couponRate': self.coupon_rate,
                'maturityDate': self.maturity_date.isoformat(),
                'issueDate': self.issue_date.isoformat(),
                'currency': self.currency,
                'minimumInvestment': self.minimum_investment,
                'totalAmount': self.total_amount,
                'amountRaised': self.amount_raised,
                'riskRating': self.risk_rating,
                'status': self.status,
                'description': self.description,
                'createdAt': self.created_at.isoformat(),
                'greenCertification': [],
                'useOfProceeds': [],
                'projectCategories': [],
                'impactTargets': [],
                'documents': []
            }

    class Project(db.Model):
        __tablename__ = 'projects'
        
        id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
        bond_id = db.Column(db.String(36), db.ForeignKey('green_bonds.id'), nullable=False)
        project_name = db.Column(db.String(200), nullable=False)
        project_type = db.Column(db.String(50), nullable=False)
        description = db.Column(db.Text, nullable=False)
        country = db.Column(db.String(100), nullable=False)
        region = db.Column(db.String(100), nullable=False)
        project_manager = db.Column(db.String(100), nullable=False)
        start_date = db.Column(db.Date, nullable=False)
        expected_completion_date = db.Column(db.Date, nullable=False)
        actual_completion_date = db.Column(db.Date, nullable=True)
        total_budget = db.Column(db.Float, nullable=False)
        allocated_funds = db.Column(db.Float, default=0)
        spent_funds = db.Column(db.Float, default=0)
        status = db.Column(db.String(20), default='planning')
        created_at = db.Column(db.DateTime, default=datetime.utcnow)
        
        def to_dict(self):
            """Convert project to dictionary for JSON serialization"""
            return {
                'id': self.id,
                'bondId': self.bond_id,
                'projectName': self.project_name,
                'projectType': self.project_type,
                'description': self.description,
                'location': {
                    'country': self.country,
                    'region': self.region
                },
                'projectManager': self.project_manager,
                'startDate': self.start_date.isoformat(),
                'expectedCompletionDate': self.expected_completion_date.isoformat(),
                'actualCompletionDate': self.actual_completion_date.isoformat() if self.actual_completion_date else None,
                'totalBudget': self.total_budget,
                'allocatedFunds': self.allocated_funds,
                'spentFunds': self.spent_funds,
                'status': self.status,
                'milestones': [],
                'impactMetrics': [],
                'sdgAlignment': [],
                'createdAt': self.created_at.isoformat()
            }

    class Investment(db.Model):
        __tablename__ = 'investments'
        
        id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
        investor_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
        bond_id = db.Column(db.String(36), db.ForeignKey('green_bonds.id'), nullable=False)
        investment_amount = db.Column(db.Float, nullable=False)
        purchase_price = db.Column(db.Float, nullable=False)
        purchase_date = db.Column(db.Date, nullable=False)
        status = db.Column(db.String(20), default='pending')
        transaction_id = db.Column(db.String(100), nullable=True)
        fees = db.Column(db.Float, default=0)
        expected_return = db.Column(db.Float, nullable=False)
        maturity_value = db.Column(db.Float, nullable=False)
        created_at = db.Column(db.DateTime, default=datetime.utcnow)
        
        def to_dict(self):
            """Convert investment to dictionary for JSON serialization"""
            return {
                'id': self.id,
                'investorId': self.investor_id,
                'bondId': self.bond_id,
                'investmentAmount': self.investment_amount,
                'purchasePrice': self.purchase_price,
                'purchaseDate': self.purchase_date.isoformat(),
                'status': self.status,
                'transactionId': self.transaction_id,
                'fees': self.fees,
                'expectedReturn': self.expected_return,
                'maturityValue': self.maturity_value,
                'createdAt': self.created_at.isoformat()
            }
    
    # Store the models globally
    _User = User
    _GreenBond = GreenBond
    _Project = Project
    _Investment = Investment
    _models_created = True
    
    return User, GreenBond, Project, Investment