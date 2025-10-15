import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  TrendingUp, 
  DollarSign, 
  Leaf, 
  BarChart3,
  PieChart,
  Activity,
  Bell,
  Settings,
  LogOut,
  Plus,
  Eye,
  Download,
  Zap,
  Droplets,
  TreePine,
  Car,
  Building,
  Users,
  Target,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { 
  mockBonds, 
  mockInvestments, 
  mockProjects, 
  mockImpactMetrics,
  mockActivityItems,
  mockNotifications
} from '../data/mockData';
import { User, UserType, Investment, GreenBond, Project, ImpactMetric } from '../types';
import { useAuth } from '../contexts/AuthContext';
import Charts from '../components/Charts';

export default function Dashboard() {
  const navigate = useNavigate();
  const { authState, logout } = useAuth();
  const [userInvestments, setUserInvestments] = useState<Investment[]>([]);
  const [userBonds, setUserBonds] = useState<GreenBond[]>([]);
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    if (!authState.isAuthenticated || !authState.user) {
      navigate('/auth');
      return;
    }

    const user = authState.user;
    
    // Load user-specific data based on user type
    const investments = mockInvestments.filter(inv => inv.investorId === user.id);
    setUserInvestments(investments);

    if (user.userType === UserType.BOND_ISSUER) {
      const bonds = mockBonds.filter(bond => bond.issuerId === user.id);
      setUserBonds(bonds);
    }

    if (user.userType === UserType.PROJECT_MANAGER) {
      const projects = mockProjects.filter(project => 
        mockBonds.some(bond => bond.id === project.bondId && bond.issuerId === user.id)
      );
      setUserProjects(projects);
    }

    setLoading(false);
  }, [navigate, authState]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!authState.user) {
    return null;
  }

  // Calculate portfolio metrics for investors
  const portfolioValue = userInvestments.reduce((sum, inv) => sum + inv.investmentAmount, 0);
  const expectedReturns = userInvestments.reduce((sum, inv) => sum + inv.expectedReturn, 0);
  const totalGains = expectedReturns - portfolioValue;
  const returnPercentage = portfolioValue > 0 ? (totalGains / portfolioValue) * 100 : 0;

  // Calculate impact metrics for investors
  const impactSummary = {
    co2Reduced: 0,
    energyGenerated: 0,
    waterSaved: 0,
    hectaresRestored: 0
  };

  userInvestments.forEach(investment => {
    const bond = mockBonds.find(b => b.id === investment.bondId);
    if (bond) {
      const projects = mockProjects.filter(p => p.bondId === bond.id);
      projects.forEach(project => {
        const metrics = mockImpactMetrics.filter(m => m.projectId === project.id);
        metrics.forEach(metric => {
          const userShare = investment.investmentAmount / bond.totalAmount;
          switch (metric.metricType) {
            case 'co2_reduction':
              impactSummary.co2Reduced += metric.currentValue * userShare;
              break;
            case 'energy_generated':
              impactSummary.energyGenerated += metric.currentValue * userShare;
              break;
            case 'water_saved':
              impactSummary.waterSaved += metric.currentValue * userShare;
              break;
            case 'hectares_restored':
              impactSummary.hectaresRestored += metric.currentValue * userShare;
              break;
          }
        });
      });
    }
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));
  };

  const getUserInitials = (user: User) => {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  };

  const getUserTypeLabel = (userType: UserType) => {
    switch (userType) {
      case UserType.RETAIL_INVESTOR:
        return 'Retail Investor';
      case UserType.INSTITUTIONAL_INVESTOR:
        return 'Institutional Investor';
      case UserType.BOND_ISSUER:
        return 'Bond Issuer';
      case UserType.PROJECT_MANAGER:
        return 'Project Manager';
      case UserType.REGULATOR:
        return 'Regulator';
      default:
        return 'User';
    }
  };

  // Prepare chart data
  const portfolioChartData = {
    labels: userInvestments.map(inv => {
      const bond = mockBonds.find(b => b.id === inv.bondId);
      return bond ? bond.bondName.substring(0, 20) + '...' : 'Unknown';
    }),
    datasets: [
      {
        label: 'Investment Amount',
        data: userInvestments.map(inv => inv.investmentAmount),
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(236, 72, 153, 0.8)',
        ],
        borderWidth: 1,
      }
    ]
  };

  const impactChartData = {
    labels: ['CO₂ Reduced (tons)', 'Energy Generated (MWh)', 'Water Saved (liters)', 'Hectares Restored'],
    datasets: [
      {
        label: 'Environmental Impact',
        data: [
          impactSummary.co2Reduced,
          impactSummary.energyGenerated,
          impactSummary.waterSaved,
          impactSummary.hectaresRestored
        ],
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
      }
    ]
  };

  const InvestorDashboard = () => (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Invested</p>
                <p className="text-2xl font-bold">{formatCurrency(portfolioValue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Expected Returns</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(expectedReturns)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Gains</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalGains)}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Return Rate</p>
                <p className="text-2xl font-bold text-purple-600">{returnPercentage.toFixed(1)}%</p>
              </div>
              <PieChart className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Allocation</CardTitle>
            <CardDescription>Distribution of your investments</CardDescription>
          </CardHeader>
          <CardContent>
            {userInvestments.length > 0 ? (
              <Charts data={portfolioChartData} type="doughnut" />
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No investments yet</p>
                <Button className="mt-4" onClick={() => navigate('/marketplace')}>
                  Browse Green Bonds
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Environmental Impact</CardTitle>
            <CardDescription>Your contribution to sustainability</CardDescription>
          </CardHeader>
          <CardContent>
            {impactSummary.co2Reduced > 0 ? (
              <Charts data={impactChartData} type="bar" />
            ) : (
              <div className="text-center py-8">
                <Leaf className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Impact data will appear as projects progress</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Investments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Your Investments</CardTitle>
          <CardDescription>Track your green bond investments</CardDescription>
        </CardHeader>
        <CardContent>
          {userInvestments.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-4">
                <Target className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No investments yet</h3>
              <p className="text-gray-600 mb-4">Start investing in green bonds to see your portfolio here.</p>
              <Button onClick={() => navigate('/marketplace')}>
                Browse Green Bonds
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {userInvestments.map((investment) => {
                const bond = mockBonds.find(b => b.id === investment.bondId);
                if (!bond) return null;

                return (
                  <div key={investment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <h4 className="font-semibold">{bond.bondName}</h4>
                      <p className="text-sm text-gray-600">{bond.issuerName}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span>Invested: {formatCurrency(investment.investmentAmount)}</span>
                        <span>Expected: {formatCurrency(investment.expectedReturn)}</span>
                        <span>Date: {formatDate(investment.purchaseDate)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={
                        investment.status === 'settled' ? 'bg-green-100 text-green-800' :
                        investment.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }>
                        {investment.status}
                      </Badge>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/bonds/${bond.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const IssuerDashboard = () => (
    <div className="space-y-6">
      {/* Issuer Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bonds Issued</p>
                <p className="text-2xl font-bold">{userBonds.length}</p>
              </div>
              <Building className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Raised</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(userBonds.reduce((sum, bond) => sum + bond.amountRaised, 0))}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Target Amount</p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(userBonds.reduce((sum, bond) => sum + bond.totalAmount, 0))}
                </p>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Funding</p>
                <p className="text-2xl font-bold text-orange-600">
                  {userBonds.length > 0 
                    ? ((userBonds.reduce((sum, bond) => sum + bond.amountRaised, 0) / 
                        userBonds.reduce((sum, bond) => sum + bond.totalAmount, 0)) * 100).toFixed(1)
                    : 0}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bonds Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Your Green Bonds</CardTitle>
              <CardDescription>Manage your issued bonds</CardDescription>
            </div>
            <Button onClick={() => navigate('/bonds/new')}>
              <Plus className="h-4 w-4 mr-2" />
              Issue New Bond
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {userBonds.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-4">
                <Building className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No bonds issued yet</h3>
              <p className="text-gray-600 mb-4">Create your first green bond to start raising funds.</p>
              <Button onClick={() => navigate('/bonds/new')}>
                Issue Green Bond
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {userBonds.map((bond) => {
                const fundingProgress = (bond.amountRaised / bond.totalAmount) * 100;
                
                return (
                  <div key={bond.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">{bond.bondName}</h4>
                        <p className="text-gray-600">{bond.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span>Yield: {bond.couponRate}%</span>
                          <span>Maturity: {formatDate(bond.maturityDate)}</span>
                          <Badge className={
                            bond.status === 'active' ? 'bg-green-100 text-green-800' :
                            bond.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }>
                            {bond.status}
                          </Badge>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/bonds/${bond.id}`)}
                      >
                        View Details
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Funding Progress</span>
                        <span className="font-medium">{fundingProgress.toFixed(1)}%</span>
                      </div>
                      <Progress value={fundingProgress} className="h-2" />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>{formatCurrency(bond.amountRaised)} raised</span>
                        <span>{formatCurrency(bond.totalAmount)} target</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const ProjectManagerDashboard = () => (
    <div className="space-y-6">
      {/* Project Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Projects</p>
                <p className="text-2xl font-bold">{userProjects.filter(p => p.status === 'in_progress').length}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Budget</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(userProjects.reduce((sum, project) => sum + project.totalBudget, 0))}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Funds Spent</p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(userProjects.reduce((sum, project) => sum + project.spentFunds, 0))}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-orange-600">
                  {userProjects.filter(p => p.status === 'completed').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects List */}
      <Card>
        <CardHeader>
          <CardTitle>Project Management</CardTitle>
          <CardDescription>Track progress and update project milestones</CardDescription>
        </CardHeader>
        <CardContent>
          {userProjects.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-4">
                <Target className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No projects assigned</h3>
              <p className="text-gray-600">Projects will appear here once bonds are funded.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {userProjects.map((project) => (
                <div key={project.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{project.projectName}</h4>
                      <p className="text-gray-600">{project.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span>Budget: {formatCurrency(project.totalBudget)}</span>
                        <span>Spent: {formatCurrency(project.spentFunds)}</span>
                        <span>Location: {project.location.region}, {project.location.country}</span>
                      </div>
                    </div>
                    <Badge className={
                      project.status === 'completed' ? 'bg-green-100 text-green-800' :
                      project.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }>
                      {project.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Budget Utilization</span>
                      <span className="font-medium">
                        {((project.spentFunds / project.totalBudget) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={(project.spentFunds / project.totalBudget) * 100} className="h-2" />
                    
                    {project.milestones.length > 0 && (
                      <div className="mt-4">
                        <h5 className="font-medium mb-2">Recent Milestones</h5>
                        <div className="space-y-2">
                          {project.milestones.slice(0, 2).map((milestone) => (
                            <div key={milestone.id} className="flex items-center gap-3 text-sm">
                              {milestone.status === 'completed' ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : milestone.status === 'in_progress' ? (
                                <Clock className="h-4 w-4 text-blue-600" />
                              ) : (
                                <AlertCircle className="h-4 w-4 text-orange-600" />
                              )}
                              <span className="flex-1">{milestone.title}</span>
                              <span className="text-gray-500">{milestone.progress}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Leaf className="h-6 w-6 text-green-600" />
                <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  GreenBonds
                </span>
              </div>
              
              <nav className="hidden md:flex items-center space-x-6">
                <Button variant="ghost" onClick={() => navigate('/dashboard')} className="text-green-600">
                  Dashboard
                </Button>
                <Button variant="ghost" onClick={() => navigate('/marketplace')}>
                  Marketplace
                </Button>
                {(authState.user.userType === UserType.RETAIL_INVESTOR || authState.user.userType === UserType.INSTITUTIONAL_INVESTOR) && (
                  <Button variant="ghost" onClick={() => navigate('/portfolio')}>
                    Portfolio
                  </Button>
                )}
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback className="bg-green-100 text-green-700">
                    {getUserInitials(authState.user)}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium">{authState.user.firstName} {authState.user.lastName}</p>
                  <p className="text-xs text-gray-600">{getUserTypeLabel(authState.user.userType)}</p>
                </div>
              </div>

              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {authState.user.firstName}!
          </h1>
          <p className="text-gray-600">
            {authState.user.userType === UserType.RETAIL_INVESTOR || authState.user.userType === UserType.INSTITUTIONAL_INVESTOR
              ? 'Track your green investments and environmental impact.'
              : authState.user.userType === UserType.BOND_ISSUER
              ? 'Manage your green bonds and monitor funding progress.'
              : 'Oversee project development and impact metrics.'
            }
          </p>
        </div>

        {/* Main Dashboard Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            <TabsTrigger value="impact">Impact Metrics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {(authState.user.userType === UserType.RETAIL_INVESTOR || authState.user.userType === UserType.INSTITUTIONAL_INVESTOR) && (
              <InvestorDashboard />
            )}
            {authState.user.userType === UserType.BOND_ISSUER && (
              <IssuerDashboard />
            )}
            {authState.user.userType === UserType.PROJECT_MANAGER && (
              <ProjectManagerDashboard />
            )}
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest actions and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockActivityItems.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className={`p-2 rounded-full ${
                        activity.type === 'investment' ? 'bg-green-100' :
                        activity.type === 'impact_verified' ? 'bg-blue-100' :
                        activity.type === 'bond_issued' ? 'bg-purple-100' :
                        'bg-gray-100'
                      }`}>
                        {activity.type === 'investment' && <DollarSign className="h-4 w-4 text-green-600" />}
                        {activity.type === 'impact_verified' && <CheckCircle className="h-4 w-4 text-blue-600" />}
                        {activity.type === 'bond_issued' && <Plus className="h-4 w-4 text-purple-600" />}
                        {activity.type === 'project_update' && <Activity className="h-4 w-4 text-orange-600" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{activity.title}</h4>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{formatDate(activity.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="impact">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Leaf className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{Math.round(impactSummary.co2Reduced).toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Tons CO₂ Reduced</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Zap className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{Math.round(impactSummary.energyGenerated).toLocaleString()}</div>
                  <div className="text-sm text-gray-600">MWh Generated</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Droplets className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{Math.round(impactSummary.waterSaved).toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Liters Saved</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <TreePine className="h-8 w-8 text-green-700 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{Math.round(impactSummary.hectaresRestored).toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Hectares Restored</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Environmental Impact Over Time</CardTitle>
                <CardDescription>Your contribution to sustainability goals</CardDescription>
              </CardHeader>
              <CardContent>
                {impactSummary.co2Reduced > 0 ? (
                  <Charts data={impactChartData} type="bar" />
                ) : (
                  <div className="text-center py-12">
                    <Leaf className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No impact data yet</h3>
                    <p className="text-gray-600 mb-4">
                      Start investing in green bonds to see your environmental impact.
                    </p>
                    <Button onClick={() => navigate('/marketplace')}>
                      Browse Green Bonds
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}