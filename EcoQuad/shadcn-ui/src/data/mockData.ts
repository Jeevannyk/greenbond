import {
  User,
  GreenBond,
  Project,
  Investment,
  ImpactMetric,
  UserType,
  KYCStatus,
  BondType,
  BondStatus,
  ProjectType,
  ProjectStatus,
  InvestmentStatus,
  ImpactMetricType,
  PortfolioSummary,
  DashboardData,
  ActivityItem,
  Notification
} from '../types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'investor@example.com',
    firstName: 'John',
    lastName: 'Investor',
    userType: UserType.RETAIL_INVESTOR,
    kycStatus: KYCStatus.APPROVED,
    createdAt: new Date('2024-01-15'),
    preferences: {
      currency: 'INR',
      language: 'en',
      notifications: true
    }
  },
  {
    id: '2',
    email: 'institution@example.com',
    firstName: 'Sarah',
    lastName: 'Manager',
    userType: UserType.INSTITUTIONAL_INVESTOR,
    companyName: 'Green Capital Partners',
    kycStatus: KYCStatus.APPROVED,
    createdAt: new Date('2024-01-10'),
    preferences: {
      currency: 'INR',
      language: 'en',
      notifications: true
    }
  },
  {
    id: '3',
    email: 'issuer@example.com',
    firstName: 'Michael',
    lastName: 'Green',
    userType: UserType.BOND_ISSUER,
    companyName: 'EcoTech Solutions',
    kycStatus: KYCStatus.APPROVED,
    createdAt: new Date('2024-01-05'),
    preferences: {
      currency: 'INR',
      language: 'en',
      notifications: true
    }
  }
];

// Mock Green Bonds
export const mockBonds: GreenBond[] = [
  {
    id: 'bond-1',
    issuerId: '3',
    issuerName: 'EcoTech Solutions',
    bondName: 'Solar Energy Development Bond 2024',
    isin: 'US12345678901',
    bondType: BondType.CORPORATE,
    faceValue: 1000,
    couponRate: 4.5,
    maturityDate: new Date('2029-12-31'),
    issueDate: new Date('2024-01-01'),
    currency: 'INR',
    minimumInvestment: 1000,
    totalAmount: 50000000,
    amountRaised: 35000000,
    greenCertification: ['Climate Bonds Standard', 'EU Green Bond Standard'],
    useOfProceeds: [
      'Solar panel installation and infrastructure',
      'Grid connection and energy storage systems',
      'Community solar programs'
    ],
    projectCategories: [ProjectType.RENEWABLE_ENERGY],
    riskRating: 'BBB+',
    status: BondStatus.ACTIVE,
    description: 'Financing large-scale solar energy projects across multiple states, targeting 500MW of clean energy capacity.',
    impactTargets: [
      {
        metricType: ImpactMetricType.CO2_REDUCTION,
        targetValue: 250000,
        unit: 'tons CO2/year',
        description: 'Annual CO2 emissions reduction from solar energy generation'
      },
      {
        metricType: ImpactMetricType.ENERGY_GENERATED,
        targetValue: 1200,
        unit: 'GWh/year',
        description: 'Annual clean energy generation capacity'
      }
    ],
    documents: [
      {
        id: 'doc-1',
        name: 'Prospectus.pdf',
        type: 'application/pdf',
        url: '/documents/prospectus.pdf',
        uploadDate: new Date('2024-01-01'),
        size: 2500000
      }
    ],
    createdAt: new Date('2024-01-01')
  },
  {
    id: 'bond-2',
    issuerId: '3',
    issuerName: 'Green Transport Corp',
    bondName: 'Electric Vehicle Infrastructure Bond',
    isin: 'US98765432109',
    bondType: BondType.CORPORATE,
    faceValue: 1000,
    couponRate: 3.8,
    maturityDate: new Date('2031-06-30'),
    issueDate: new Date('2024-02-01'),
    currency: 'INR',
    minimumInvestment: 5000,
    totalAmount: 75000000,
    amountRaised: 42000000,
    greenCertification: ['Climate Bonds Standard'],
    useOfProceeds: [
      'EV charging station network expansion',
      'Battery technology development',
      'Smart grid integration'
    ],
    projectCategories: [ProjectType.CLEAN_TRANSPORT],
    riskRating: 'A-',
    status: BondStatus.ACTIVE,
    description: 'Building comprehensive EV charging infrastructure across urban and suburban areas.',
    impactTargets: [
      {
        metricType: ImpactMetricType.CO2_REDUCTION,
        targetValue: 180000,
        unit: 'tons CO2/year',
        description: 'CO2 reduction from increased EV adoption'
      }
    ],
    documents: [],
    createdAt: new Date('2024-02-01')
  },
  {
    id: 'bond-3',
    issuerId: '3',
    issuerName: 'AquaTech Industries',
    bondName: 'Water Conservation Technology Bond',
    isin: 'US11223344556',
    bondType: BondType.CORPORATE,
    faceValue: 1000,
    couponRate: 4.2,
    maturityDate: new Date('2030-03-31'),
    issueDate: new Date('2024-03-01'),
    currency: 'INR',
    minimumInvestment: 2500,
    totalAmount: 30000000,
    amountRaised: 18000000,
    greenCertification: ['EU Green Bond Standard'],
    useOfProceeds: [
      'Advanced water treatment facilities',
      'Smart water management systems',
      'Drought-resistant agriculture technology'
    ],
    projectCategories: [ProjectType.WATER_MANAGEMENT],
    riskRating: 'BBB',
    status: BondStatus.ACTIVE,
    description: 'Developing innovative water conservation and treatment technologies for sustainable water management.',
    impactTargets: [
      {
        metricType: ImpactMetricType.WATER_SAVED,
        targetValue: 50000000,
        unit: 'liters/year',
        description: 'Annual water conservation through efficient systems'
      }
    ],
    documents: [],
    createdAt: new Date('2024-03-01')
  },
  {
    id: 'bond-4',
    issuerId: '3',
    issuerName: 'Forest Restoration Fund',
    bondName: 'Biodiversity Conservation Bond',
    isin: 'US55667788990',
    bondType: BondType.SUPRANATIONAL,
    faceValue: 1000,
    couponRate: 3.5,
    maturityDate: new Date('2034-12-31'),
    issueDate: new Date('2024-04-01'),
    currency: 'INR',
    minimumInvestment: 1000,
    totalAmount: 100000000,
    amountRaised: 25000000,
    greenCertification: ['Climate Bonds Standard', 'Forest Stewardship Council'],
    useOfProceeds: [
      'Forest restoration and reforestation',
      'Wildlife habitat protection',
      'Sustainable forestry practices'
    ],
    projectCategories: [ProjectType.BIODIVERSITY],
    riskRating: 'AA-',
    status: BondStatus.ACTIVE,
    description: 'Large-scale forest restoration and biodiversity conservation across multiple continents.',
    impactTargets: [
      {
        metricType: ImpactMetricType.HECTARES_RESTORED,
        targetValue: 50000,
        unit: 'hectares',
        description: 'Forest area restored and protected'
      },
      {
        metricType: ImpactMetricType.CO2_REDUCTION,
        targetValue: 500000,
        unit: 'tons CO2/year',
        description: 'Annual CO2 sequestration from restored forests'
      }
    ],
    documents: [],
    createdAt: new Date('2024-04-01')
  }
];

// Mock Projects
export const mockProjects: Project[] = [
  {
    id: 'project-1',
    bondId: 'bond-1',
    projectName: 'California Solar Farm Network',
    projectType: ProjectType.RENEWABLE_ENERGY,
    description: 'Development of 5 large-scale solar farms across California, totaling 300MW capacity.',
    location: {
      country: 'United States',
      region: 'California',
      coordinates: [36.7783, -119.4179]
    },
    projectManager: 'Dr. Elena Rodriguez',
    startDate: new Date('2024-02-01'),
    expectedCompletionDate: new Date('2025-08-31'),
    totalBudget: 25000000,
    allocatedFunds: 25000000,
    spentFunds: 8500000,
    status: ProjectStatus.IN_PROGRESS,
    milestones: [
      {
        id: 'milestone-1',
        title: 'Site Preparation Complete',
        description: 'Land acquisition and site preparation for all 5 locations',
        targetDate: new Date('2024-04-30'),
        completedDate: new Date('2024-04-28'),
        status: 'completed',
        progress: 100
      },
      {
        id: 'milestone-2',
        title: 'Solar Panel Installation',
        description: 'Installation of solar panels and inverters',
        targetDate: new Date('2024-12-31'),
        status: 'in_progress',
        progress: 45
      }
    ],
    impactMetrics: [],
    sdgAlignment: [7, 13, 15],
    createdAt: new Date('2024-02-01')
  },
  {
    id: 'project-2',
    bondId: 'bond-2',
    projectName: 'Urban EV Charging Network',
    projectType: ProjectType.CLEAN_TRANSPORT,
    description: 'Installation of 500 fast-charging stations across major metropolitan areas.',
    location: {
      country: 'United States',
      region: 'Multiple States'
    },
    projectManager: 'James Chen',
    startDate: new Date('2024-03-01'),
    expectedCompletionDate: new Date('2026-02-28'),
    totalBudget: 35000000,
    allocatedFunds: 35000000,
    spentFunds: 12000000,
    status: ProjectStatus.IN_PROGRESS,
    milestones: [
      {
        id: 'milestone-3',
        title: 'Phase 1 Deployment',
        description: 'Installation of first 100 charging stations',
        targetDate: new Date('2024-08-31'),
        status: 'in_progress',
        progress: 75
      }
    ],
    impactMetrics: [],
    sdgAlignment: [7, 11, 13],
    createdAt: new Date('2024-03-01')
  }
];

// Mock Impact Metrics
export const mockImpactMetrics: ImpactMetric[] = [
  {
    id: 'impact-1',
    projectId: 'project-1',
    metricType: ImpactMetricType.CO2_REDUCTION,
    baselineValue: 0,
    targetValue: 250000,
    currentValue: 85000,
    unit: 'tons CO2/year',
    measurementDate: new Date('2024-09-01'),
    verificationStatus: 'verified',
    verificationSource: 'Climate Impact Verification',
    createdAt: new Date('2024-09-01')
  },
  {
    id: 'impact-2',
    projectId: 'project-1',
    metricType: ImpactMetricType.ENERGY_GENERATED,
    baselineValue: 0,
    targetValue: 1200,
    currentValue: 420,
    unit: 'GWh/year',
    measurementDate: new Date('2024-09-01'),
    verificationStatus: 'verified',
    verificationSource: 'Energy Output Monitoring',
    createdAt: new Date('2024-09-01')
  },
  {
    id: 'impact-3',
    projectId: 'project-2',
    metricType: ImpactMetricType.CO2_REDUCTION,
    baselineValue: 0,
    targetValue: 180000,
    currentValue: 45000,
    unit: 'tons CO2/year',
    measurementDate: new Date('2024-09-01'),
    verificationStatus: 'verified',
    verificationSource: 'Transport Emissions Analysis',
    createdAt: new Date('2024-09-01')
  }
];

// Mock Investments
export const mockInvestments: Investment[] = [
  {
    id: 'investment-1',
    investorId: '1',
    bondId: 'bond-1',
    investmentAmount: 10000,
    purchasePrice: 1000,
    purchaseDate: new Date('2024-03-15'),
    status: InvestmentStatus.SETTLED,
    transactionId: 'TXN-001',
    fees: 25,
    expectedReturn: 10450,
    maturityValue: 10450,
    createdAt: new Date('2024-03-15')
  },
  {
    id: 'investment-2',
    investorId: '1',
    bondId: 'bond-3',
    investmentAmount: 5000,
    purchasePrice: 1000,
    purchaseDate: new Date('2024-05-20'),
    status: InvestmentStatus.SETTLED,
    transactionId: 'TXN-002',
    fees: 15,
    expectedReturn: 5210,
    maturityValue: 5210,
    createdAt: new Date('2024-05-20')
  },
  {
    id: 'investment-3',
    investorId: '2',
    bondId: 'bond-2',
    investmentAmount: 50000,
    purchasePrice: 1000,
    purchaseDate: new Date('2024-04-10'),
    status: InvestmentStatus.SETTLED,
    transactionId: 'TXN-003',
    fees: 100,
    expectedReturn: 51900,
    maturityValue: 51900,
    createdAt: new Date('2024-04-10')
  }
];

// Mock Portfolio Summary
export const mockPortfolioSummary: PortfolioSummary = {
  totalInvested: 15000,
  currentValue: 15750,
  unrealizedGains: 750,
  realizedGains: 0,
  totalReturnPercentage: 5.0,
  impactScore: 8.5,
  riskScore: 6.2,
  investments: mockInvestments.filter(inv => inv.investorId === '1'),
  impactSummary: {
    co2Reduced: 130000,
    energyGenerated: 420,
    waterSaved: 0,
    hectaresRestored: 0
  }
};

// Mock Activity Items
export const mockActivityItems: ActivityItem[] = [
  {
    id: 'activity-1',
    type: 'investment',
    title: 'Investment Confirmed',
    description: 'Your investment in Solar Energy Development Bond has been confirmed',
    timestamp: new Date('2024-09-25'),
    metadata: { bondId: 'bond-1', amount: 10000 }
  },
  {
    id: 'activity-2',
    type: 'impact_verified',
    title: 'Impact Metrics Updated',
    description: 'New impact data verified for California Solar Farm Network',
    timestamp: new Date('2024-09-20'),
    metadata: { projectId: 'project-1' }
  },
  {
    id: 'activity-3',
    type: 'bond_issued',
    title: 'New Bond Available',
    description: 'Biodiversity Conservation Bond is now available for investment',
    timestamp: new Date('2024-09-15'),
    metadata: { bondId: 'bond-4' }
  }
];

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'success',
    title: 'Investment Processed',
    message: 'Your investment of $10,000 in Solar Energy Development Bond has been successfully processed.',
    timestamp: new Date('2024-09-25'),
    read: false,
    actionUrl: '/dashboard'
  },
  {
    id: 'notif-2',
    type: 'info',
    title: 'Impact Report Available',
    message: 'Q3 2024 impact report for your investments is now available for download.',
    timestamp: new Date('2024-09-20'),
    read: true,
    actionUrl: '/dashboard'
  }
];

// Mock Dashboard Data
export const mockDashboardData: DashboardData = {
  user: mockUsers[0],
  portfolio: mockPortfolioSummary,
  bonds: mockBonds,
  projects: mockProjects,
  recentActivity: mockActivityItems,
  notifications: mockNotifications
};

// Helper functions for localStorage
export const saveToLocalStorage = (key: string, data: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const getFromLocalStorage = (key: string) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
};

// Initialize localStorage with mock data
export const initializeMockData = () => {
  saveToLocalStorage('users', mockUsers);
  saveToLocalStorage('bonds', mockBonds);
  saveToLocalStorage('projects', mockProjects);
  saveToLocalStorage('investments', mockInvestments);
  saveToLocalStorage('impactMetrics', mockImpactMetrics);
};

// Get current user from localStorage
export const getCurrentUser = (): User | null => {
  return getFromLocalStorage('currentUser');
};

// Set current user in localStorage
export const setCurrentUser = (user: User | null) => {
  saveToLocalStorage('currentUser', user);
};

// Authentication helpers
export const authenticateUser = (email: string, password: string): User | null => {
  const users = getFromLocalStorage('users') || mockUsers;
  const user = users.find((u: User) => u.email === email);
  
  if (user) {
    setCurrentUser(user);
    return user;
  }
  
  return null;
};

export const registerUser = (userData: Partial<User>): User => {
  const users = getFromLocalStorage('users') || mockUsers;
  const newUser: User = {
    id: `user-${Date.now()}`,
    email: userData.email!,
    firstName: userData.firstName!,
    lastName: userData.lastName!,
    userType: userData.userType!,
    companyName: userData.companyName,
    kycStatus: KYCStatus.PENDING,
    createdAt: new Date(),
    preferences: {
      currency: 'INR',
      language: 'en',
      notifications: true
    }
  };
  
  users.push(newUser);
  saveToLocalStorage('users', users);
  setCurrentUser(newUser);
  
  return newUser;
};

export const logoutUser = () => {
  setCurrentUser(null);
};