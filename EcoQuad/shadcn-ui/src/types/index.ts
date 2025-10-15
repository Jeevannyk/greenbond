export enum UserType {
  RETAIL_INVESTOR = 'retail_investor',
  INSTITUTIONAL_INVESTOR = 'institutional_investor',
  BOND_ISSUER = 'bond_issuer',
  PROJECT_MANAGER = 'project_manager',
  REGULATOR = 'regulator'
}

export enum KYCStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export enum BondType {
  CORPORATE = 'corporate',
  SOVEREIGN = 'sovereign',
  MUNICIPAL = 'municipal',
  SUPRANATIONAL = 'supranational'
}

export enum BondStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  CLOSED = 'closed',
  MATURED = 'matured'
}

export enum ProjectType {
  RENEWABLE_ENERGY = 'renewable_energy',
  ENERGY_EFFICIENCY = 'energy_efficiency',
  CLEAN_TRANSPORT = 'clean_transport',
  WATER_MANAGEMENT = 'water_management',
  BIODIVERSITY = 'biodiversity',
  WASTE_MANAGEMENT = 'waste_management'
}

export enum ProjectStatus {
  PLANNING = 'planning',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum InvestmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  SETTLED = 'settled',
  CANCELLED = 'cancelled'
}

export enum ImpactMetricType {
  CO2_REDUCTION = 'co2_reduction',
  ENERGY_GENERATED = 'energy_generated',
  WATER_SAVED = 'water_saved',
  HECTARES_RESTORED = 'hectares_restored',
  JOBS_CREATED = 'jobs_created',
  PEOPLE_SERVED = 'people_served'
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: UserType;
  companyName?: string;
  kycStatus: KYCStatus;
  createdAt: Date;
  preferences: {
    currency: string;
    language: string;
    notifications: boolean;
  };
}

export interface GreenBond {
  id: string;
  issuerId: string;
  issuerName: string;
  bondName: string;
  isin: string;
  bondType: BondType;
  faceValue: number;
  couponRate: number;
  maturityDate: Date;
  issueDate: Date;
  currency: string;
  minimumInvestment: number;
  totalAmount: number;
  amountRaised: number;
  greenCertification: string[];
  useOfProceeds: string[];
  projectCategories: ProjectType[];
  riskRating: string;
  status: BondStatus;
  description: string;
  impactTargets: ImpactTarget[];
  documents: Document[];
  createdAt: Date;
}

export interface Project {
  id: string;
  bondId: string;
  projectName: string;
  projectType: ProjectType;
  description: string;
  location: {
    country: string;
    region: string;
    coordinates?: [number, number];
  };
  projectManager: string;
  startDate: Date;
  expectedCompletionDate: Date;
  actualCompletionDate?: Date;
  totalBudget: number;
  allocatedFunds: number;
  spentFunds: number;
  status: ProjectStatus;
  milestones: Milestone[];
  impactMetrics: ImpactMetric[];
  sdgAlignment: number[];
  createdAt: Date;
}

export interface Investment {
  id: string;
  investorId: string;
  bondId: string;
  investmentAmount: number;
  purchasePrice: number;
  purchaseDate: Date;
  status: InvestmentStatus;
  transactionId: string;
  fees: number;
  expectedReturn: number;
  maturityValue: number;
  createdAt: Date;
}

export interface ImpactMetric {
  id: string;
  projectId: string;
  metricType: ImpactMetricType;
  baselineValue: number;
  targetValue: number;
  currentValue: number;
  unit: string;
  measurementDate: Date;
  verificationStatus: 'unverified' | 'verified' | 'disputed';
  verificationSource?: string;
  createdAt: Date;
}

export interface ImpactTarget {
  metricType: ImpactMetricType;
  targetValue: number;
  unit: string;
  description: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  targetDate: Date;
  completedDate?: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
  progress: number;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadDate: Date;
  size: number;
}

export interface PortfolioSummary {
  totalInvested: number;
  currentValue: number;
  unrealizedGains: number;
  realizedGains: number;
  totalReturnPercentage: number;
  impactScore: number;
  riskScore: number;
  investments: Investment[];
  impactSummary: {
    co2Reduced: number;
    energyGenerated: number;
    waterSaved: number;
    hectaresRestored: number;
  };
}

export interface MarketFilters {
  bondTypes: BondType[];
  projectCategories: ProjectType[];
  riskRatings: string[];
  minInvestment: number;
  maxInvestment: number;
  minYield: number;
  maxYield: number;
  currencies: string[];
  searchQuery: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
    tension?: number;
    fill?: boolean;
  }[];
}

export interface DashboardData {
  user: User;
  portfolio?: PortfolioSummary;
  bonds?: GreenBond[];
  projects?: Project[];
  recentActivity: ActivityItem[];
  notifications: Notification[];
}

export interface ActivityItem {
  id: string;
  type: 'investment' | 'bond_issued' | 'project_update' | 'impact_verified';
  title: string;
  description: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}

export interface AppState {
  auth: AuthState;
  bonds: GreenBond[];
  investments: Investment[];
  projects: Project[];
  currentUser: User | null;
  filters: MarketFilters;
  loading: boolean;
  error: string | null;
}