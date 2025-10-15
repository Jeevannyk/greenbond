import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Leaf, 
  TrendingUp, 
  Shield, 
  Globe, 
  Zap, 
  Droplets, 
  TreePine, 
  Car,
  Users,
  Target,
  BarChart3,
  CheckCircle
} from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const features = [
    {
      icon: <Leaf className="h-8 w-8 text-green-600" />,
      title: 'Green Certified Bonds',
      description: 'All bonds are certified by leading standards like Climate Bonds Initiative and EU Green Bond Standard.'
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-blue-600" />,
      title: 'Transparent Returns',
      description: 'Clear visibility into financial returns and environmental impact metrics for every investment.'
    },
    {
      icon: <Shield className="h-8 w-8 text-purple-600" />,
      title: 'Secure Platform',
      description: 'Bank-level security with regulatory compliance and comprehensive audit trails.'
    },
    {
      icon: <Globe className="h-8 w-8 text-indigo-600" />,
      title: 'Global Impact',
      description: 'Support projects worldwide contributing to UN Sustainable Development Goals.'
    }
  ];

  const impactCategories = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'Renewable Energy',
      description: 'Solar, wind, and hydro projects',
      color: 'bg-yellow-100 text-yellow-800'
    },
    {
      icon: <Car className="h-6 w-6" />,
      title: 'Clean Transport',
      description: 'EV infrastructure and sustainable mobility',
      color: 'bg-blue-100 text-blue-800'
    },
    {
      icon: <Droplets className="h-6 w-6" />,
      title: 'Water Management',
      description: 'Conservation and treatment technologies',
      color: 'bg-cyan-100 text-cyan-800'
    },
    {
      icon: <TreePine className="h-6 w-6" />,
      title: 'Biodiversity',
      description: 'Forest restoration and habitat protection',
      color: 'bg-green-100 text-green-800'
    }
  ];

  const stats = [
    { label: 'Total Bonds Issued', value: '₹2.9T', description: 'Global green bond market size' },
    { label: 'CO₂ Reduced', value: '1.2M tons', description: 'Annual emissions reduction' },
    { label: 'Clean Energy', value: '5.8 GW', description: 'Renewable capacity funded' },
    { label: 'Active Investors', value: '50K+', description: 'Growing community' }
  ];

  const userTypes = [
    {
      title: 'Retail Investors',
      description: 'Individual investors looking to make a positive impact',
      features: ['Minimum ₹1,000 investment', 'Portfolio tracking', 'Impact reporting'],
      icon: <Users className="h-8 w-8 text-green-600" />
    },
    {
      title: 'Institutional Investors',
      description: 'Organizations seeking sustainable investment opportunities',
      features: ['Bulk investment options', 'Advanced analytics', 'ESG compliance'],
      icon: <BarChart3 className="h-8 w-8 text-blue-600" />
    },
    {
      title: 'Bond Issuers',
      description: 'Organizations funding green projects',
      features: ['Bond issuance platform', 'Investor relations', 'Impact tracking'],
      icon: <Target className="h-8 w-8 text-purple-600" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              GreenBonds
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/auth')}>
              Sign In
            </Button>
            <Button onClick={() => navigate('/auth')}>
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge className="mb-6 bg-green-100 text-green-800 hover:bg-green-200">
            🌱 Bridging Private Capital with Sustainable Development
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
            Invest in Our Planet's Future
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            The world's first comprehensive platform for green bond investments. 
            Fund sustainable projects, track environmental impact, and earn competitive returns 
            while contributing to a cleaner, healthier planet.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-green-600 hover:bg-green-700" onClick={() => navigate('/marketplace')}>
              Explore Green Bonds
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/auth')}>
              Start Investing Today
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm font-medium text-gray-600 mb-1">{stat.label}</div>
                <div className="text-xs text-gray-500">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose GreenBonds?</h2>
            <p className="text-xl text-gray-600">
              Transparent, secure, and impactful investing for a sustainable future
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 rounded-full bg-gray-50">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Categories */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Investment Categories</h2>
            <p className="text-xl text-gray-600">
              Diversify your impact across multiple environmental sectors
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {impactCategories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                <CardHeader className="pb-4">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${category.color} mb-3`}>
                    {category.icon}
                  </div>
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* User Types */}
      <section className="py-20 px-4 bg-white/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Built for Every Investor</h2>
            <p className="text-xl text-gray-600">
              Tailored experiences for different investor types and needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {userTypes.map((userType, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 rounded-full bg-gray-50">
                    {userType.icon}
                  </div>
                  <CardTitle className="text-xl">{userType.title}</CardTitle>
                  <CardDescription className="text-base">{userType.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {userType.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">
              Simple steps to start making a positive impact
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="invest">Invest</TabsTrigger>
              <TabsTrigger value="track">Track Impact</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Overview</CardTitle>
                  <CardDescription>
                    Discover how our platform connects investors with verified green projects
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-green-600 font-bold">1</span>
                      </div>
                      <h4 className="font-semibold mb-2">Browse Projects</h4>
                      <p className="text-sm text-gray-600">Explore verified green bonds across multiple categories</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-blue-600 font-bold">2</span>
                      </div>
                      <h4 className="font-semibold mb-2">Make Investment</h4>
                      <p className="text-sm text-gray-600">Invest securely with transparent terms and conditions</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-purple-600 font-bold">3</span>
                      </div>
                      <h4 className="font-semibold mb-2">Track Progress</h4>
                      <p className="text-sm text-gray-600">Monitor both financial returns and environmental impact</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="invest" className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Investment Process</CardTitle>
                  <CardDescription>
                    Step-by-step guide to making your first green bond investment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Create Account & Complete KYC</h4>
                        <p className="text-sm text-gray-600">Quick registration with identity verification for security</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Choose Your Bonds</h4>
                        <p className="text-sm text-gray-600">Filter by risk, return, impact category, and investment amount</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Secure Payment</h4>
                        <p className="text-sm text-gray-600">Multiple payment options with bank-level security</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="track" className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Impact Tracking</CardTitle>
                  <CardDescription>
                    Real-time monitoring of your environmental and financial impact
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Environmental Metrics</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>• CO₂ emissions reduced</li>
                        <li>• Clean energy generated</li>
                        <li>• Water saved and treated</li>
                        <li>• Forest area restored</li>
                        <li>• Jobs created</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Financial Returns</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>• Portfolio performance</li>
                        <li>• Interest payments</li>
                        <li>• Risk assessment</li>
                        <li>• Maturity projections</li>
                        <li>• Tax implications</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-4xl font-bold mb-4">Ready to Make an Impact?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of investors who are already funding a sustainable future
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary" 
              className="bg-white text-green-600 hover:bg-gray-100"
              onClick={() => navigate('/marketplace')}
            >
              Browse Green Bonds
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-green-600"
              onClick={() => navigate('/auth')}
            >
              Create Account
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Leaf className="h-6 w-6 text-green-400" />
                <span className="text-xl font-bold">GreenBonds</span>
              </div>
              <p className="text-gray-400 text-sm">
                Bridging private capital with sustainable development for a better tomorrow.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">How it Works</a></li>
                <li><a href="#" className="hover:text-white">Green Bonds</a></li>
                <li><a href="#" className="hover:text-white">Impact Tracking</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">API Reference</a></li>
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 GreenBonds Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}