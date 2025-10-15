import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  TrendingUp, 
  Calendar, 
  DollarSign,
  Leaf,
  ArrowLeft,
  Star,
  Shield,
  Zap,
  Droplets,
  TreePine,
  Car,
  Building,
  Recycle
} from 'lucide-react';
import { mockBonds } from '../data/mockData';
import { GreenBond, BondType, ProjectType } from '../types';

export default function BondMarketplace() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBondType, setSelectedBondType] = useState<string>('all');
  const [selectedProjectType, setSelectedProjectType] = useState<string>('all');
  const [selectedRiskRating, setSelectedRiskRating] = useState<string>('all');
  const [minInvestment, setMinInvestment] = useState([0]);
  const [maxInvestment, setMaxInvestment] = useState([100000]);
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort bonds
  const filteredBonds = useMemo(() => {
    const filtered = mockBonds.filter(bond => {
      // Search filter
      const matchesSearch = bond.bondName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           bond.issuerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           bond.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Bond type filter
      const matchesBondType = selectedBondType === 'all' || bond.bondType === selectedBondType;

      // Project type filter
      const matchesProjectType = selectedProjectType === 'all' || 
                                 bond.projectCategories.includes(selectedProjectType as ProjectType);

      // Risk rating filter
      const matchesRiskRating = selectedRiskRating === 'all' || bond.riskRating === selectedRiskRating;

      // Investment amount filter
      const matchesInvestment = bond.minimumInvestment >= minInvestment[0] && 
                               bond.minimumInvestment <= maxInvestment[0];

      return matchesSearch && matchesBondType && matchesProjectType && matchesRiskRating && matchesInvestment;
    });

    // Sort bonds
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.bondName.localeCompare(b.bondName);
        case 'yield':
          return b.couponRate - a.couponRate;
        case 'maturity':
          return new Date(a.maturityDate).getTime() - new Date(b.maturityDate).getTime();
        case 'amount':
          return b.totalAmount - a.totalAmount;
        case 'raised':
          return (b.amountRaised / b.totalAmount) - (a.amountRaised / a.totalAmount);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, selectedBondType, selectedProjectType, selectedRiskRating, minInvestment, maxInvestment, sortBy]);

  const getProjectIcon = (type: ProjectType) => {
    switch (type) {
      case ProjectType.RENEWABLE_ENERGY:
        return <Zap className="h-4 w-4" />;
      case ProjectType.CLEAN_TRANSPORT:
        return <Car className="h-4 w-4" />;
      case ProjectType.WATER_MANAGEMENT:
        return <Droplets className="h-4 w-4" />;
      case ProjectType.BIODIVERSITY:
        return <TreePine className="h-4 w-4" />;
      case ProjectType.ENERGY_EFFICIENCY:
        return <Building className="h-4 w-4" />;
      case ProjectType.WASTE_MANAGEMENT:
        return <Recycle className="h-4 w-4" />;
      default:
        return <Leaf className="h-4 w-4" />;
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
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));
  };

  const BondCard = ({ bond }: { bond: GreenBond }) => {
    const fundingProgress = (bond.amountRaised / bond.totalAmount) * 100;

    return (
      <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <CardTitle className="text-lg line-clamp-2">{bond.bondName}</CardTitle>
              <CardDescription className="text-sm text-gray-600">{bond.issuerName}</CardDescription>
            </div>
            <Badge className={getRiskRatingColor(bond.riskRating)}>
              {bond.riskRating}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-1 mb-3">
            {bond.projectCategories.slice(0, 2).map((category, index) => (
              <Badge key={index} variant="outline" className={`text-xs ${getProjectTypeColor(category)}`}>
                {getProjectIcon(category)}
                <span className="ml-1">{category.replace('_', ' ')}</span>
              </Badge>
            ))}
            {bond.projectCategories.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{bond.projectCategories.length - 2}
              </Badge>
            )}
          </div>

          <p className="text-sm text-gray-600 line-clamp-2">{bond.description}</p>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-4">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-500">Yield</div>
                <div className="font-semibold text-green-600">{bond.couponRate}%</div>
              </div>
              <div>
                <div className="text-gray-500">Maturity</div>
                <div className="font-semibold">{formatDate(bond.maturityDate)}</div>
              </div>
              <div>
                <div className="text-gray-500">Min. Investment</div>
                <div className="font-semibold">{formatCurrency(bond.minimumInvestment)}</div>
              </div>
              <div>
                <div className="text-gray-500">Bond Type</div>
                <div className="font-semibold capitalize">{bond.bondType.replace('_', ' ')}</div>
              </div>
            </div>

            {/* Funding Progress */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">Funding Progress</span>
                <span className="text-sm font-semibold">{fundingProgress.toFixed(1)}%</span>
              </div>
              <Progress value={fundingProgress} className="h-2" />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{formatCurrency(bond.amountRaised)} raised</span>
                <span>{formatCurrency(bond.totalAmount)} target</span>
              </div>
            </div>

            {/* Certifications */}
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-600" />
              <span className="text-xs text-gray-600">
                {bond.greenCertification.length} certification{bond.greenCertification.length !== 1 ? 's' : ''}
              </span>
            </div>

            <Button 
              className="w-full" 
              onClick={() => navigate(`/bonds/${bond.id}`)}
            >
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const BondListItem = ({ bond }: { bond: GreenBond }) => {
    const fundingProgress = (bond.amountRaised / bond.totalAmount) * 100;

    return (
      <Card className="hover:shadow-md transition-shadow duration-300 cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-4 mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg line-clamp-1">{bond.bondName}</h3>
                  <p className="text-sm text-gray-600">{bond.issuerName}</p>
                </div>
                <Badge className={getRiskRatingColor(bond.riskRating)}>
                  {bond.riskRating}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                {bond.projectCategories.slice(0, 3).map((category, index) => (
                  <Badge key={index} variant="outline" className={`text-xs ${getProjectTypeColor(category)}`}>
                    {getProjectIcon(category)}
                    <span className="ml-1">{category.replace('_', ' ')}</span>
                  </Badge>
                ))}
              </div>

              <p className="text-sm text-gray-600 line-clamp-1 mb-4">{bond.description}</p>

              <div className="grid grid-cols-5 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Yield</div>
                  <div className="font-semibold text-green-600">{bond.couponRate}%</div>
                </div>
                <div>
                  <div className="text-gray-500">Maturity</div>
                  <div className="font-semibold">{formatDate(bond.maturityDate)}</div>
                </div>
                <div>
                  <div className="text-gray-500">Min. Investment</div>
                  <div className="font-semibold">{formatCurrency(bond.minimumInvestment)}</div>
                </div>
                <div>
                  <div className="text-gray-500">Total Amount</div>
                  <div className="font-semibold">{formatCurrency(bond.totalAmount)}</div>
                </div>
                <div>
                  <div className="text-gray-500">Progress</div>
                  <div className="font-semibold">{fundingProgress.toFixed(1)}%</div>
                </div>
              </div>
            </div>

            <div className="ml-6 flex flex-col items-end gap-3">
              <Button onClick={() => navigate(`/bonds/${bond.id}`)}>
                View Details
              </Button>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Shield className="h-3 w-3" />
                {bond.greenCertification.length} cert{bond.greenCertification.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
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
                onClick={() => navigate('/dashboard')}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              
              <div className="flex items-center space-x-2">
                <Leaf className="h-6 w-6 text-green-600" />
                <h1 className="text-2xl font-bold">Green Bond Marketplace</h1>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <div className="w-80 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div className="space-y-2">
                  <Label>Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search bonds..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Bond Type */}
                <div className="space-y-2">
                  <Label>Bond Type</Label>
                  <Select value={selectedBondType} onValueChange={setSelectedBondType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value={BondType.CORPORATE}>Corporate</SelectItem>
                      <SelectItem value={BondType.SOVEREIGN}>Sovereign</SelectItem>
                      <SelectItem value={BondType.MUNICIPAL}>Municipal</SelectItem>
                      <SelectItem value={BondType.SUPRANATIONAL}>Supranational</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Project Category */}
                <div className="space-y-2">
                  <Label>Project Category</Label>
                  <Select value={selectedProjectType} onValueChange={setSelectedProjectType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value={ProjectType.RENEWABLE_ENERGY}>Renewable Energy</SelectItem>
                      <SelectItem value={ProjectType.CLEAN_TRANSPORT}>Clean Transport</SelectItem>
                      <SelectItem value={ProjectType.WATER_MANAGEMENT}>Water Management</SelectItem>
                      <SelectItem value={ProjectType.BIODIVERSITY}>Biodiversity</SelectItem>
                      <SelectItem value={ProjectType.ENERGY_EFFICIENCY}>Energy Efficiency</SelectItem>
                      <SelectItem value={ProjectType.WASTE_MANAGEMENT}>Waste Management</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Risk Rating */}
                <div className="space-y-2">
                  <Label>Risk Rating</Label>
                  <Select value={selectedRiskRating} onValueChange={setSelectedRiskRating}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Ratings</SelectItem>
                      <SelectItem value="AAA">AAA</SelectItem>
                      <SelectItem value="AA+">AA+</SelectItem>
                      <SelectItem value="AA">AA</SelectItem>
                      <SelectItem value="AA-">AA-</SelectItem>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="BBB+">BBB+</SelectItem>
                      <SelectItem value="BBB">BBB</SelectItem>
                      <SelectItem value="BBB-">BBB-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Investment Range */}
                <div className="space-y-4">
                  <Label>Minimum Investment Range</Label>
                  <div className="px-2">
                    <Slider
                      value={minInvestment}
                      onValueChange={setMinInvestment}
                      max={50000}
                      step={1000}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-2">
                      <span>{formatCurrency(minInvestment[0])}</span>
                      <span>{formatCurrency(50000)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Market Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Market Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{filteredBonds.length}</div>
                  <div className="text-sm text-gray-600">Available Bonds</div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-semibold">
                      {formatCurrency(filteredBonds.reduce((sum, bond) => sum + bond.totalAmount, 0))}
                    </div>
                    <div className="text-gray-600">Total Value</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">
                      {(filteredBonds.reduce((sum, bond) => sum + bond.couponRate, 0) / filteredBonds.length || 0).toFixed(1)}%
                    </div>
                    <div className="text-gray-600">Avg. Yield</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Sort and Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold">
                  {filteredBonds.length} Bond{filteredBonds.length !== 1 ? 's' : ''} Available
                </h2>
                <p className="text-gray-600">
                  Showing {filteredBonds.length} of {mockBonds.length} total bonds
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Label htmlFor="sort">Sort by:</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="yield">Yield (High to Low)</SelectItem>
                      <SelectItem value="maturity">Maturity Date</SelectItem>
                      <SelectItem value="amount">Total Amount</SelectItem>
                      <SelectItem value="raised">Funding Progress</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Bonds Grid/List */}
            {filteredBonds.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <div className="text-gray-400 mb-4">
                    <Search className="h-12 w-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No bonds found</h3>
                  <p className="text-gray-600">
                    Try adjusting your filters or search terms to find more bonds.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-4'
              }>
                {filteredBonds.map((bond) => (
                  viewMode === 'grid' 
                    ? <BondCard key={bond.id} bond={bond} />
                    : <BondListItem key={bond.id} bond={bond} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}