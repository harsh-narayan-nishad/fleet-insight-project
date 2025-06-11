
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Download, TrendingUp, Users, DollarSign, Calendar, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FleetFiltersPanel from '@/components/FleetFiltersPanel';
import InteractiveReportTemplates from '@/components/reports/InteractiveReportTemplates';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const FleetAnalyticsDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [activeFilters, setActiveFilters] = useState({
    yearRange: { start: 2025, span: 10 },
    lob: 'Electric Operations',
    costCenter: 'Fleet Maintenance',
    vehicleType: 'Light Vehicle',
    status: 'Active'
  });

  // Mock data for the Fleet Spending Trends chart
  const spendingData = [
    { year: '2025', amount: 12000000 },
    { year: '2026', amount: 15500000 },
    { year: '2027', amount: 17200000 },
    { year: '2028', amount: 14800000 },
    { year: '2029', amount: 16900000 },
    { year: '2030', amount: 15200000 },
    { year: '2031', amount: 17800000 },
    { year: '2032', amount: 16100000 },
    { year: '2033', amount: 18500000 },
    { year: '2034', amount: 19200000 }
  ];

  const formatCurrency = (value: number) => {
    return `$${(value / 1000000).toFixed(0)}M`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Homepage
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Fleet Capital Planning</h1>
              <p className="text-slate-600">Vehicle Replacement Forecasting Dashboard</p>
            </div>
          </div>
          <Badge variant="outline" className="text-sm">
            Last Updated: 2024-06-07
          </Badge>
        </div>

        {/* Fleet Filters Panel */}
        <FleetFiltersPanel 
          activeFilters={activeFilters}
          onFiltersChange={setActiveFilters}
        />

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-8 bg-white border border-slate-200">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Overview</TabsTrigger>
            <TabsTrigger value="radio-equipment" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Radio Equipment</TabsTrigger>
            <TabsTrigger value="executive" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Executive</TabsTrigger>
            <TabsTrigger value="forecasts" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Forecasts</TabsTrigger>
            <TabsTrigger value="vehicles" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Vehicles</TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Reports</TabsTrigger>
            <TabsTrigger value="timeline" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Timeline</TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Fleet Spending Trends Chart */}
            <Card className="bg-white border border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-slate-800">Fleet Spending Trends</CardTitle>
                </div>
                <Button variant="outline" size="sm" className="text-blue-600 border-blue-200">
                  Interactive
                </Button>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-6 text-slate-600">
                  10-year fleet spending forecast - Click to explore detailed analytics
                </CardDescription>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={spendingData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="year" 
                        stroke="#64748b"
                        fontSize={12}
                      />
                      <YAxis 
                        tickFormatter={formatCurrency}
                        stroke="#64748b"
                        fontSize={12}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="amount" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white border border-slate-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-700">Total Fleet Size</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900">2,847</div>
                  <p className="text-xs text-muted-foreground">+2.1% from last quarter</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white border border-slate-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-700">Replacement Cost (2025)</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900">$142.3M</div>
                  <p className="text-xs text-muted-foreground">Projected budget</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white border border-slate-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-700">Vehicles Due (2025)</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900">456</div>
                  <p className="text-xs text-muted-foreground">Scheduled replacements</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white border border-slate-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-700">Cost Efficiency</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900">94.2%</div>
                  <p className="text-xs text-muted-foreground">vs budget target</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="radio-equipment" className="space-y-6">
            <Card className="bg-white border border-slate-200">
              <CardHeader>
                <CardTitle>Radio Equipment Management</CardTitle>
                <CardDescription>Specialized equipment tracking and forecasting</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Radio equipment management dashboard coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="executive" className="space-y-6">
            <Card className="bg-white border border-slate-200">
              <CardHeader>
                <CardTitle>Executive Dashboard</CardTitle>
                <CardDescription>High-level overview for executive decision making</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Executive summary and key metrics will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forecasts" className="space-y-6">
            <Card className="bg-white border border-slate-200">
              <CardHeader>
                <CardTitle>Forecasting Engine</CardTitle>
                <CardDescription>AI-powered vehicle replacement predictions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Forecasting tools and predictions will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vehicles" className="space-y-6">
            <Card className="bg-white border border-slate-200">
              <CardHeader>
                <CardTitle>Vehicle Inventory</CardTitle>
                <CardDescription>Complete vehicle inventory management</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Vehicle inventory system will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card className="bg-white border border-slate-200">
              <CardHeader>
                <CardTitle>Interactive Reports</CardTitle>
                <CardDescription>Generate and export comprehensive fleet reports</CardDescription>
              </CardHeader>
              <CardContent>
                <InteractiveReportTemplates />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
            <Card className="bg-white border border-slate-200">
              <CardHeader>
                <CardTitle>Timeline View</CardTitle>
                <CardDescription>Vehicle replacement timeline and scheduling</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Timeline view will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-white border border-slate-200">
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>Configure dashboard preferences and parameters</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Settings panel will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FleetAnalyticsDashboard;
