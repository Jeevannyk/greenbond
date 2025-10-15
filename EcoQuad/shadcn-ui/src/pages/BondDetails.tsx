import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft, 
  Calendar, 
  DollarSign,
  TrendingUp, 
  Shield, 
  Download,
  Leaf,
  Zap,
  Droplets,
  TreePine,
  Car,
  Building,
  Recycle,
  Target,
  CheckCircle,
  Clock,
  AlertTriangle,
  Globe,
  Users,
  BarChart3
} from 'lucide-react';
import { mockBonds, mockProjects, mockImpactMetrics, getCurrentUser, mockInvestments } from '../data/mockData';
import { GreenBond, ProjectType, ImpactMetricType } from '../types';
import Charts from '../components/Charts';
import { createOrder, openCheckout } from '../lib/razorpayClient';

export default function BondDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [bond, setBond] = useState<GreenBond | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [showInvestmentForm, setShowInvestmentForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const currentUser = getCurrentUser();

  useEffect(() => {
    const foundBond = mockBonds.find(b => b.id === id);
    setBond(foundBond || null);
  }, [id]);

  if (!bond) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardContent className="py-12 text-center">
            <h2 className="text-xl font-semibold mb-2">Bond not found</h2>
            <p className="text-gray-600 mb-4">The bond you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/marketplace')}>
              Back to Marketplace
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const fundingProgress = (bond.amountRaised / bond.totalAmount) * 100;
  const remainingAmount = bond.totalAmount - bond.amountRaised;
  const projects = mockProjects.filter(p => p.bondId === bond.id);
  const impactMetrics = mockImpactMetrics.filter(m => 
    projects.some(p => p.id === m.projectId)
  );

  const getProjectIcon = (type: ProjectType) => {
    switch (type) {
      case ProjectType.RENEWABLE_ENERGY:
        return <Zap className="h-5 w-5" />;
      case ProjectType.CLEAN_TRANSPORT:
        return <Car className="h-5 w-5" />;
      case ProjectType.WATER_MANAGEMENT:
        return <Droplets className="h-5 w-5" />;
      case ProjectType.BIODIVERSITY:
        return <TreePine className="h-5 w-5" />;
      case ProjectType.ENERGY_EFFICIENCY:
        return <Building className="h-5 w-5" />;
      case ProjectType.WASTE_MANAGEMENT:
        return <Recycle className="h-5 w-5" />;
      default:
        return <Leaf className="h-5 w-5" />;
    }
  };

  const getProjectTypeColor = (type: ProjectType) => {
    switch (type) {
      case ProjectType.RENEWABLE_ENERGY:
        return 'bg-yellow-100 text-yellow-800';
      case ProjectType.CLEAN_TRANSPORT:
        return 'bg-blue-100 text-blue-800';
      case ProjectType.WATER_MANAGEMENT:
        return 'bg-cyan-100 text-cyan-800';
      case ProjectType.BIODIVERSITY:
        return 'bg-green-100 text-green-800';
      case ProjectType.ENERGY_EFFICIENCY:
        return 'bg-purple-100 text-purple-800';
      case ProjectType.WASTE_MANAGEMENT:
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskRatingColor = (rating: string) => {
    if (rating.startsWith('AA')) return 'bg-green-100 text-green-800';
    if (rating.startsWith('A')) return 'bg-blue-100 text-blue-800';
    if (rating.startsWith('BBB')) return 'bg-yellow-100 text-yellow-800';
    if (rating.startsWith('BB')) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

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
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  };

  const handleInvestment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const amount = parseFloat(investmentAmount);

    // Validation
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid investment amount');
      setLoading(false);
      return;
    }

    if (amount < bond.minimumInvestment) {
      setError(`Minimum investment is ${formatCurrency(bond.minimumInvestment)}`);
      setLoading(false);
      return;
    }

    if (amount > remainingAmount) {
      setError(`Maximum available investment is ${formatCurrency(remainingAmount)}`);
      setLoading(false);
      return;
    }

    if (!currentUser) {
      setError('Please sign in to make an investment');
      setLoading(false);
      return;
    }

    try {
      // Create server side order
      const resp = await createOrder(amount);
      const order = resp.order;
      const key = resp.key;

      // Open Razorpay checkout
      await openCheckout(order, key, async (paymentResp: any) => {
        try {
          // Verify payment on server
          const backendUrl = (import.meta as any).env?.VITE_PAYMENT_BACKEND_URL || 'http://localhost:5000';
          const verifyResp = await fetch(`${backendUrl}/verify-payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(paymentResp)
          });
          if (!verifyResp.ok) throw new Error('Payment verification failed');

          // Record investment locally (after successful verification)
          const newInvestment = {
            id: `investment-${Date.now()}`,
            investorId: currentUser.id,
            bondId: bond.id,
            investmentAmount: amount,
            purchasePrice: bond.faceValue,
            purchaseDate: new Date(),
            status: 'confirmed' as const,
            transactionId: paymentResp.razorpay_payment_id,
            fees: amount * 0.005, // 0.5% fee
            expectedReturn: amount * (1 + bond.couponRate / 100 * 5),
            maturityValue: amount * (1 + bond.couponRate / 100 * 5),
            createdAt: new Date()
          };

          const existingInvestments = JSON.parse(localStorage.getItem('investments') || '[]');
          existingInvestments.push(newInvestment);
          localStorage.setItem('investments', JSON.stringify(existingInvestments));

          // Update bond amount raised
          const updatedBond = { ...bond, amountRaised: bond.amountRaised + amount };
          const existingBonds = JSON.parse(localStorage.getItem('bonds') || '[]');
          const bondIndex = existingBonds.findIndex((b: GreenBond) => b.id === bond.id);
          if (bondIndex !== -1) {
            existingBonds[bondIndex] = updatedBond;
            localStorage.setItem('bonds', JSON.stringify(existingBonds));
            setBond(updatedBond);
          }

          setSuccess(`Investment of ${formatCurrency(amount)} confirmed! Transaction ID: ${newInvestment.transactionId}`);
          setInvestmentAmount('');
          setShowInvestmentForm(false);
        } catch (err: any) {
          console.error(err);
          setError('Payment verification failed. Please contact support.');
        } finally {
          setLoading(false);
        }
      }, (failure: any) => {
        console.error('payment failed', failure);
        setError('Payment failed or cancelled');
        setLoading(false);
      });

    } catch (err: any) {
      console.error('Create order failed:', err);
      // Show backend-provided message if available
      setError(err.message || 'Investment failed. Please try again.');
      setLoading(false);
    }
  };

  // Prepare chart data for impact metrics
  const impactChartData = {
    labels: impactMetrics.map(m => m.metricType.replace('_', ' ').toUpperCase()),
    datasets: [
      {
        label: 'Current Progress',
        data: impactMetrics.map(m => (m.currentValue / m.targetValue) * 100),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
      }
    ]
  };

  const timelineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    datasets: [
      {
        label: 'Funding Progress (%)',
        data: [0, 15, 28, 42, 55, 63, 70, 70, fundingProgress],
        borderColor: 'rgba(34, 197, 94, 1)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/marketplace')}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Marketplace
              </Button>
              
              <div className="flex items-center space-x-2">
                <Leaf className="h-6 w-6 text-green-600" />
                <h1 className="text-xl font-bold">Bond Details</h1>
              </div>
            </div>

            {currentUser && (
              <Button 
                onClick={() => setShowInvestmentForm(true)}
                disabled={fundingProgress >= 100}
                className="bg-green-600 hover:bg-green-700"
              >
                {fundingProgress >= 100 ? 'Fully Funded' : 'Invest Now'}
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bond Header */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">{bond.bondName}</CardTitle>
                    <CardDescription className="text-lg">{bond.issuerName}</CardDescription>
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                      {bond.projectCategories.map((category, index) => (
                        <Badge key={index} className={getProjectTypeColor(category)}>
                          {getProjectIcon(category)}
                          <span className="ml-1">{category.replace('_', ' ')}</span>
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={getRiskRatingColor(bond.riskRating)} variant="outline">
                      <Shield className="h-3 w-3 mr-1" />
                      {bond.riskRating}
                    </Badge>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      {bond.bondType.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{bond.description}</p>
              </CardContent>
            </Card>

            {/* Key Metrics */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">{bond.couponRate}%</div>
                  <div className="text-sm text-gray-600">Annual Yield</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-lg font-bold">{formatDate(bond.maturityDate)}</div>
                  <div className="text-sm text-gray-600">Maturity Date</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <DollarSign className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-lg font-bold">{formatCurrency(bond.minimumInvestment)}</div>
                  <div className="text-sm text-gray-600">Min. Investment</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Target className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-lg font-bold">{fundingProgress.toFixed(1)}%</div>
                  <div className="text-sm text-gray-600">Funded</div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Information Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="impact">Impact</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Bond Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-500">ISIN</Label>
                          <p className="font-mono">{bond.isin}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Face Value</Label>
                          <p>{formatCurrency(bond.faceValue)}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Issue Date</Label>
                          <p>{formatDate(bond.issueDate)}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Currency</Label>
                          <p>{bond.currency}</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Total Amount</Label>
                          <p className="text-lg font-semibold">{formatCurrency(bond.totalAmount)}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Amount Raised</Label>
                          <p className="text-lg font-semibold text-green-600">{formatCurrency(bond.amountRaised)}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Remaining</Label>
                          <p className="text-lg font-semibold text-blue-600">{formatCurrency(remainingAmount)}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Use of Proceeds</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {bond.useOfProceeds.map((use, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{use}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Green Certifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {bond.greenCertification.map((cert, index) => (
                        <Badge key={index} variant="outline" className="bg-green-50 text-green-700">
                          <Shield className="h-3 w-3 mr-1" />
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="projects" className="space-y-6">
                {projects.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <div className="text-gray-400 mb-4">
                        <Building className="h-12 w-12 mx-auto" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">No projects available</h3>
                      <p className="text-gray-600">Project information will be available once funding begins.</p>
                    </CardContent>
                  </Card>
                ) : (
                  projects.map((project) => (
                    <Card key={project.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="flex items-center gap-2">
                              {getProjectIcon(project.projectType)}
                              {project.projectName}
                            </CardTitle>
                            <CardDescription>{project.location.country}, {project.location.region}</CardDescription>
                          </div>
                          <Badge className={
                            project.status === 'completed' ? 'bg-green-100 text-green-800' :
                            project.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }>
                            {project.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 mb-4">{project.description}</p>
                        
                        <div className="grid md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <Label className="text-sm font-medium text-gray-500">Project Manager</Label>
                            <p>{project.projectManager}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-500">Start Date</Label>
                            <p>{formatDate(project.startDate)}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-500">Expected Completion</Label>
                            <p>{formatDate(project.expectedCompletionDate)}</p>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <Label className="text-sm font-medium text-gray-500">Total Budget</Label>
                            <p className="font-semibold">{formatCurrency(project.totalBudget)}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-500">Allocated Funds</Label>
                            <p className="font-semibold text-green-600">{formatCurrency(project.allocatedFunds)}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-500">Spent Funds</Label>
                            <p className="font-semibold text-blue-600">{formatCurrency(project.spentFunds)}</p>
                          </div>
                        </div>

                        {project.milestones.length > 0 && (
                          <div>
                            <Label className="text-sm font-medium text-gray-500 mb-2 block">Milestones</Label>
                            <div className="space-y-2">
                              {project.milestones.map((milestone) => (
                                <div key={milestone.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                  {milestone.status === 'completed' ? (
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                  ) : milestone.status === 'in_progress' ? (
                                    <Clock className="h-5 w-5 text-blue-600" />
                                  ) : milestone.status === 'delayed' ? (
                                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                                  ) : (
                                    <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                                  )}
                                  <div className="flex-1">
                                    <p className="font-medium">{milestone.title}</p>
                                    <p className="text-sm text-gray-600">{milestone.description}</p>
                                    <p className="text-xs text-gray-500">Target: {formatDate(milestone.targetDate)}</p>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-sm font-medium">{milestone.progress}%</div>
                                    <Progress value={milestone.progress} className="w-20 h-2" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {project.sdgAlignment.length > 0 && (
                          <div className="mt-4">
                            <Label className="text-sm font-medium text-gray-500 mb-2 block">SDG Alignment</Label>
                            <div className="flex flex-wrap gap-1">
                              {project.sdgAlignment.map((sdg) => (
                                <Badge key={sdg} variant="outline" className="bg-blue-50 text-blue-700">
                                  <Globe className="h-3 w-3 mr-1" />
                                  SDG {sdg}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              <TabsContent value="impact" className="space-y-6">
                {impactMetrics.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <div className="text-gray-400 mb-4">
                        <BarChart3 className="h-12 w-12 mx-auto" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">No impact data available</h3>
                      <p className="text-gray-600">Impact metrics will be available as projects progress.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle>Impact Progress</CardTitle>
                        <CardDescription>Current progress towards environmental impact targets</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Charts data={impactChartData} type="bar" />
                      </CardContent>
                    </Card>

                    <div className="grid md:grid-cols-2 gap-6">
                      {impactMetrics.map((metric) => (
                        <Card key={metric.id}>
                          <CardHeader>
                            <CardTitle className="text-lg capitalize">
                              {metric.metricType.replace('_', ' ')}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Progress</span>
                                <span className="font-semibold">
                                  {((metric.currentValue / metric.targetValue) * 100).toFixed(1)}%
                                </span>
                              </div>
                              <Progress value={(metric.currentValue / metric.targetValue) * 100} />
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <div className="text-gray-500">Current</div>
                                  <div className="font-semibold">
                                    {metric.currentValue.toLocaleString()} {metric.unit}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-gray-500">Target</div>
                                  <div className="font-semibold">
                                    {metric.targetValue.toLocaleString()} {metric.unit}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span className="text-gray-600">
                                  Verified by {metric.verificationSource}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle>Impact Targets</CardTitle>
                        <CardDescription>Environmental goals for this bond</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {bond.impactTargets.map((target, index) => (
                            <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                              <Target className="h-5 w-5 text-green-600 mt-0.5" />
                              <div>
                                <h4 className="font-medium capitalize">
                                  {target.metricType.replace('_', ' ')}
                                </h4>
                                <p className="text-sm text-gray-600 mb-1">{target.description}</p>
                                <p className="text-sm font-semibold">
                                  Target: {target.targetValue.toLocaleString()} {target.unit}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </TabsContent>

              <TabsContent value="documents" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Bond Documents</CardTitle>
                    <CardDescription>Official documents and disclosures</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {bond.documents.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="text-gray-400 mb-4">
                          <Download className="h-12 w-12 mx-auto" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">No documents available</h3>
                        <p className="text-gray-600">Documents will be available soon.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {bond.documents.map((doc) => (
                          <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                            <div className="flex items-center gap-3">
                              <Download className="h-5 w-5 text-gray-400" />
                              <div>
                                <p className="font-medium">{doc.name}</p>
                                <p className="text-sm text-gray-600">
                                  {(doc.size / 1024 / 1024).toFixed(1)} MB • {formatDate(doc.uploadDate)}
                                </p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              Download
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="timeline" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Funding Timeline</CardTitle>
                    <CardDescription>Progress of bond funding over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Charts data={timelineData} type="line" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Key Dates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                        <div>
                          <p className="font-medium">Issue Date</p>
                          <p className="text-sm text-gray-600">{formatDate(bond.issueDate)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                        <div>
                          <p className="font-medium">Maturity Date</p>
                          <p className="text-sm text-gray-600">{formatDate(bond.maturityDate)}</p>
                        </div>
                      </div>
                      {projects.map((project) => (
                        <div key={project.id} className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                          <div>
                            <p className="font-medium">{project.projectName} Completion</p>
                            <p className="text-sm text-gray-600">{formatDate(project.expectedCompletionDate)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Investment Card */}
            <Card>
              <CardHeader>
                <CardTitle>Investment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Amount</span>
                    <span className="font-semibold">{formatCurrency(bond.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Amount Raised</span>
                    <span className="font-semibold text-green-600">{formatCurrency(bond.amountRaised)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Remaining</span>
                    <span className="font-semibold text-blue-600">{formatCurrency(remainingAmount)}</span>
                  </div>
                </div>

                <Progress value={fundingProgress} className="h-3" />
                <p className="text-center text-sm text-gray-600">{fundingProgress.toFixed(1)}% funded</p>

                <div className="space-y-2 pt-4 border-t">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Annual Yield</span>
                    <span className="font-semibold text-green-600">{bond.couponRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Min. Investment</span>
                    <span className="font-semibold">{formatCurrency(bond.minimumInvestment)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Maturity</span>
                    <span className="font-semibold">{formatDate(bond.maturityDate)}</span>
                  </div>
                </div>

                {currentUser && !showInvestmentForm && (
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => setShowInvestmentForm(true)}
                    disabled={fundingProgress >= 100}
                  >
                    {fundingProgress >= 100 ? 'Fully Funded' : 'Invest Now'}
                  </Button>
                )}

                {!currentUser && (
                  <Button 
                    className="w-full"
                    onClick={() => navigate('/auth')}
                  >
                    Sign In to Invest
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Investment Form */}
            {showInvestmentForm && currentUser && (
              <Card>
                <CardHeader>
                  <CardTitle>Make Investment</CardTitle>
                  <CardDescription>Enter your investment amount</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleInvestment} className="space-y-4">
                    {error && (
                      <Alert className="border-red-200 bg-red-50">
                        <AlertDescription className="text-red-800">{error}</AlertDescription>
                      </Alert>
                    )}
                    
                    {success && (
                      <Alert className="border-green-200 bg-green-50">
                        <AlertDescription className="text-green-800">{success}</AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="amount">Investment Amount (INR)</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder={`Min. ${formatCurrency(bond.minimumInvestment)}`}
                        value={investmentAmount}
                        onChange={(e) => setInvestmentAmount(e.target.value)}
                        min={bond.minimumInvestment}
                        max={remainingAmount}
                        step="100"
                        required
                        disabled={loading}
                      />
                      <p className="text-xs text-gray-500">
                        Available: {formatCurrency(remainingAmount)}
                      </p>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Investment Amount</span>
                        <span>{investmentAmount ? formatCurrency(parseFloat(investmentAmount) || 0) : '₹0'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Platform Fee (0.5%)</span>
                        <span>{investmentAmount ? formatCurrency((parseFloat(investmentAmount) || 0) * 0.005) : '₹0'}</span>
                      </div>
                      <div className="flex justify-between font-semibold border-t pt-2">
                        <span>Total</span>
                        <span>{investmentAmount ? formatCurrency((parseFloat(investmentAmount) || 0) * 1.005) : '₹0'}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1" disabled={loading}>
                        {loading ? 'Processing...' : 'Confirm Investment'}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setShowInvestmentForm(false)}
                        disabled={loading}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Impact Summary */}
            {impactMetrics.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Impact Summary</CardTitle>
                  <CardDescription>Environmental impact to date</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {impactMetrics.map((metric) => (
                    <div key={metric.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {metric.metricType === ImpactMetricType.CO2_REDUCTION && <Leaf className="h-4 w-4 text-green-600" />}
                        {metric.metricType === ImpactMetricType.ENERGY_GENERATED && <Zap className="h-4 w-4 text-yellow-600" />}
                        {metric.metricType === ImpactMetricType.WATER_SAVED && <Droplets className="h-4 w-4 text-blue-600" />}
                        <span className="text-sm capitalize">{metric.metricType.replace('_', ' ')}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-sm">{metric.currentValue.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">{metric.unit}</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Risk Information */}
            <Card>
              <CardHeader>
                <CardTitle>Risk Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Credit Rating</span>
                  <Badge className={getRiskRatingColor(bond.riskRating)}>
                    {bond.riskRating}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Bond Type</span>
                  <span className="text-sm font-medium capitalize">{bond.bondType.replace('_', ' ')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Currency</span>
                  <span className="text-sm font-medium">{bond.currency}</span>
                </div>
                <p className="text-xs text-gray-600 pt-2 border-t">
                  All investments carry risk. Past performance is not indicative of future results.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}