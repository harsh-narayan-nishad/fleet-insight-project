
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { ArrowLeft, TrendingUp, DollarSign, Calendar, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdvancedAnalyticsPage = () => {
  const navigate = useNavigate();

  // Sample detailed data
  const detailedSpendingData = Array.from({ length: 10 }, (_, index) => {
    const year = 2025 + index;
    const baseSpending = 15000000;
    const variance = Math.random() * 0.3 - 0.15;
    const spending = baseSpending * (1 + variance) * (1.03 ** index);
    
    return {
      year: year.toString(),
      totalSpending: Math.round(spending),
      maintenance: Math.round(spending * 0.3),
      acquisition: Math.round(spending * 0.5),
      fuel: Math.round(spending * 0.2),
      vehicleCount: 450 + index * 12,
    };
  });

  const categoryBreakdown = [
    { name: 'Light Vehicles', value: 45, color: '#FFB5E8' },
    { name: 'Heavy Vehicles', value: 30, color: '#B5DEFF' },
    { name: 'Electric Vehicles', value: 15, color: '#B4E7CE' },
    { name: 'Powered Equipment', value: 10, color: '#FDBCB4' },
  ];

  const formatCurrency = (value: number) => `$${(value / 1000000).toFixed(1)}M`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-white/80 backdrop-blur-sm border-indigo-200/50 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/fleet-analytics')}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Fleet Analytics
                </Button>
                <div>
                  <CardTitle className="flex items-center gap-2 text-slate-800">
                    <TrendingUp className="h-6 w-6 text-indigo-500" />
                    Advanced Fleet Analytics
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    Detailed spending analysis and fleet metrics (2025-2034)
                  </CardDescription>
                </div>
              </div>
              <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">
                Interactive Dashboard
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium">Total Spending</span>
              </div>
              <div className="text-2xl font-bold mt-2">$167.2M</div>
              <div className="text-sm text-green-600">+3.2% YoY</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium">Fleet Size</span>
              </div>
              <div className="text-2xl font-bold mt-2">558</div>
              <div className="text-sm text-blue-600">+12 vehicles</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium">EV Adoption</span>
              </div>
              <div className="text-2xl font-bold mt-2">15%</div>
              <div className="text-sm text-purple-600">+3% this year</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-orange-600" />
                <span className="text-sm font-medium">Avg Cost/Vehicle</span>
              </div>
              <div className="text-2xl font-bold mt-2">$300K</div>
              <div className="text-sm text-orange-600">+2.1% inflation</div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Spending Chart */}
        <Card className="bg-white/80 backdrop-blur-sm border-indigo-200/50 shadow-lg">
          <CardHeader>
            <CardTitle className="text-slate-800">Detailed Spending Breakdown</CardTitle>
            <CardDescription className="text-slate-600">
              Annual spending by category with trend analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={detailedSpendingData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" stroke="#64748b" />
                  <YAxis tickFormatter={formatCurrency} stroke="#64748b" />
                  <Tooltip formatter={(value) => `$${(value as number / 1000000).toFixed(1)}M`} />
                  <Line type="monotone" dataKey="totalSpending" stroke="#6366f1" strokeWidth={3} name="Total" />
                  <Line type="monotone" dataKey="acquisition" stroke="#22c55e" strokeWidth={2} name="Acquisition" />
                  <Line type="monotone" dataKey="maintenance" stroke="#f59e0b" strokeWidth={2} name="Maintenance" />
                  <Line type="monotone" dataKey="fuel" stroke="#ef4444" strokeWidth={2} name="Fuel" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Secondary Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border-blue-200/50 shadow-lg">
            <CardHeader>
              <CardTitle className="text-slate-800">Fleet Composition</CardTitle>
              <CardDescription className="text-slate-600">
                Vehicle distribution by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryBreakdown}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {categoryBreakdown.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-green-200/50 shadow-lg">
            <CardHeader>
              <CardTitle className="text-slate-800">Annual Vehicle Count</CardTitle>
              <CardDescription className="text-slate-600">
                Fleet growth over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={detailedSpendingData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="year" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip />
                    <Bar dataKey="vehicleCount" fill="#22c55e" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalyticsPage;
