import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { TrendingUp, DollarSign, Filter, Calendar, BarChart3, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FleetDataService } from '@/services/fleetDataService';
import { DrillThroughData, ChartDataPoint } from '@/types/fleet';
import DrillThroughModal from './DrillThroughModal';
import FleetFiltersPanel from './FleetFiltersPanel';
import InteractiveReportTemplates from './reports/InteractiveReportTemplates';
import { useNavigate } from 'react-router-dom';

const FleetAnalyticsDashboard = () => {
  const [drillThroughData, setDrillThroughData] = useState<DrillThroughData | null>(null);
  const [showDrillThrough, setShowDrillThrough] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    yearRange: { start: 2025, span: 10 },
    lob: 'all',
    costCenter: 'all',
    vehicleType: 'all',
    status: 'all'
  });

  const navigate = useNavigate();
  const top10Expensive = FleetDataService.getTop10MostExpensive();

  // Generate yearly spending data for the interactive chart
  const yearlySpendingData = Array.from({ length: 10 }, (_, index) => {
    const year = 2025 + index;
    const baseSpending = 15000000;
    const variance = Math.random() * 0.3 - 0.15; // +/- 15% variance
    const spending = baseSpending * (1 + variance) * (1.03 ** index); // 3% growth
    
    return {
      year: year.toString(),
      spending: Math.round(spending),
      vehicleCount: 450 + index * 12,
      rawData: top10Expensive // Use existing data for drill-through
    };
  });

  const handleChartClick = (data: any, chartTitle: string) => {
    console.log('Chart clicked:', data, chartTitle);
    
    if (data && data.rawData && data.rawData.length > 0) {
      const totalValue = data.rawData.reduce((sum, vehicle) => 
        sum + (vehicle.acquisitionValue || 0), 0
      );
      
      setDrillThroughData({
        title: `${chartTitle} - ${data.year || data.category || 'Selected Data'}`,
        filters: [
          { field: 'lcReplaceYear', value: data.year },
        ],
        vehicles: data.rawData,
        totalValue,
        totalCount: data.rawData.length
      });
      setShowDrillThrough(true);
    }
  };

  const handleInteractiveChartClick = () => {
    // Navigate to a detailed analytics page
    navigate('/advanced-analytics');
  };

  const handleFiltersChange = (newFilters: any) => {
    setActiveFilters(newFilters);
    console.log('Filters updated:', newFilters);
  };

  const COLORS = ['#FFB5E8', '#B5DEFF', '#C7CEEA', '#FDBCB4', '#B4E7CE', '#FFD1DC'];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-lg p-3 shadow-lg">
          <p className="font-medium text-slate-800">{`${label}`}</p>
          {payload.map((pld: any, index: number) => (
            <p key={index} style={{ color: pld.color }} className="font-medium">
              {`${pld.dataKey}: $${pld.value?.toLocaleString()}`}
            </p>
          ))}
          <p className="text-sm text-slate-500 mt-1">Click for details</p>
        </div>
      );
    }
    return null;
  };

  const InteractiveTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-lg p-3 shadow-lg">
          <p className="font-medium text-slate-800">{`Year ${label}`}</p>
          {payload.map((pld: any, index: number) => (
            <p key={index} style={{ color: pld.color }} className="font-medium">
              {`Annual Spending: $${(pld.value / 1000000).toFixed(1)}M`}
            </p>
          ))}
          <p className="text-sm text-blue-500 mt-1 font-medium">🔗 Click to open detailed analysis</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate('/')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Fleet Analytics Dashboard</h1>
          <p className="text-slate-600">Comprehensive fleet management and analytics</p>
        </div>
      </div>

      {/* Filters Panel */}
      <FleetFiltersPanel 
        activeFilters={activeFilters}
        onFiltersChange={handleFiltersChange}
      />

      {/* Main Content - Full Width */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-gradient-to-r from-violet-100 to-pink-100 p-1 rounded-xl">
          <TabsTrigger 
            value="overview" 
            className="data-[state=active]:bg-white data-[state=active]:text-violet-700 data-[state=active]:shadow-sm rounded-lg px-6 py-2"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="radio" 
            className="data-[state=active]:bg-white data-[state=active]:text-violet-700 data-[state=active]:shadow-sm rounded-lg px-6 py-2"
          >
            Radio Equipment
          </TabsTrigger>
          <TabsTrigger 
            value="executive" 
            className="data-[state=active]:bg-white data-[state=active]:text-violet-700 data-[state=active]:shadow-sm rounded-lg px-6 py-2"
          >
            Executive
          </TabsTrigger>
          <TabsTrigger 
            value="forecasts" 
            className="data-[state=active]:bg-white data-[state=active]:text-violet-700 data-[state=active]:shadow-sm rounded-lg px-6 py-2"
          >
            Forecasts
          </TabsTrigger>
          <TabsTrigger 
            value="vehicles" 
            className="data-[state=active]:bg-white data-[state=active]:text-violet-700 data-[state=active]:shadow-sm rounded-lg px-6 py-2"
          >
            Vehicles
          </TabsTrigger>
          <TabsTrigger 
            value="reports" 
            className="data-[state=active]:bg-white data-[state=active]:text-violet-700 data-[state=active]:shadow-sm rounded-lg px-6 py-2"
          >
            Reports
          </TabsTrigger>
          <TabsTrigger 
            value="timeline" 
            className="data-[state=active]:bg-white data-[state=active]:text-violet-700 data-[state=active]:shadow-sm rounded-lg px-6 py-2"
          >
            Timeline
          </TabsTrigger>
          <TabsTrigger 
            value="settings" 
            className="data-[state=active]:bg-white data-[state=active]:text-violet-700 data-[state=active]:shadow-sm rounded-lg px-6 py-2"
          >
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Interactive Fleet Spending Trends */}
          <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200/50 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300" onClick={handleInteractiveChartClick}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-700">
                <BarChart3 className="h-5 w-5 text-indigo-500" />
                Fleet Spending Trends
                <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 ml-auto">
                  Interactive
                </Badge>
              </CardTitle>
              <CardDescription className="text-slate-600">
                10-year fleet spending forecast - Click to explore detailed analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={yearlySpendingData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="year" 
                      stroke="#64748b"
                    />
                    <YAxis 
                      tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`}
                      stroke="#64748b"
                    />
                    <Tooltip content={<InteractiveTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="spending" 
                      stroke="#6366f1"
                      strokeWidth={3}
                      dot={{ fill: '#6366f1', strokeWidth: 2, r: 6 }}
                      activeDot={{ r: 8, stroke: '#6366f1', strokeWidth: 2, fill: '#ffffff' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-indigo-200/50">
                <p className="text-sm text-indigo-700 font-medium">
                  💡 Click anywhere on this chart to open the detailed analytics dashboard
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Cost Analysis Section */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200/50 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-700">
                <DollarSign className="h-5 w-5 text-blue-500" />
                Cost Analysis
              </CardTitle>
              <CardDescription className="text-slate-600">
                Fleet acquisition value breakdown
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Card className="bg-white/60 backdrop-blur-sm border-slate-200/50">
                <CardHeader>
                  <CardTitle className="text-slate-700">Top 10 Most Expensive Equipment</CardTitle>
                  <CardDescription className="text-slate-600">Ranked by acquisition value</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={top10Expensive} layout="horizontal">
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis 
                          type="number" 
                          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                          stroke="#64748b"
                        />
                        <YAxis 
                          type="category" 
                          dataKey="year" 
                          width={200} 
                          stroke="#64748b"
                          fontSize={12}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar 
                          dataKey="value" 
                          fill="#FFB5E8"
                          stroke="#db2777"
                          strokeWidth={1}
                          style={{ cursor: 'pointer' }}
                          onClick={(data) => handleChartClick(data, 'Most Expensive Equipment')}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="radio" className="space-y-6">
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200/50">
            <CardHeader>
              <CardTitle className="text-slate-700">Radio Equipment</CardTitle>
              <CardDescription className="text-slate-600">
                Radio equipment spend analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-8 text-center">
                <p className="text-slate-500">Radio Equipment tab content coming in next phase...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="executive" className="space-y-6">
          <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200/50">
            <CardHeader>
              <CardTitle className="text-slate-700">Executive Dashboard</CardTitle>
              <CardDescription className="text-slate-600">
                High-level fleet overview and KPIs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-8 text-center">
                <p className="text-slate-500">Executive tab content coming in next phase...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forecasts" className="space-y-6">
          <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200/50">
            <CardHeader>
              <CardTitle className="text-slate-700">Fleet Forecasts</CardTitle>
              <CardDescription className="text-slate-600">
                Replacement forecasting and budget planning
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-8 text-center">
                <p className="text-slate-500">Forecasts tab content coming in next phase...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vehicles" className="space-y-6">
          <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200/50">
            <CardHeader>
              <CardTitle className="text-slate-700">Vehicle Management</CardTitle>
              <CardDescription className="text-slate-600">
                Fleet inventory and lifecycle management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-8 text-center">
                <p className="text-slate-500">Vehicles tab content coming in next phase...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200/50">
            <CardHeader>
              <CardTitle className="text-slate-700">Interactive Report Templates</CardTitle>
              <CardDescription className="text-slate-600">
                Generate, download, and analyze comprehensive fleet reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InteractiveReportTemplates />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200/50">
            <CardHeader>
              <CardTitle className="text-slate-700">Timeline View</CardTitle>
              <CardDescription className="text-slate-600">
                Vehicle replacement timeline and scheduling
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-8 text-center">
                <p className="text-slate-500">Timeline tab content coming in next phase...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200/50">
            <CardHeader>
              <CardTitle className="text-slate-700">Settings & Configuration</CardTitle>
              <CardDescription className="text-slate-600">
                Reference data and system configuration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-8 text-center">
                <p className="text-slate-500">Settings tab content coming in next phase...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <DrillThroughModal 
        isOpen={showDrillThrough}
        onClose={() => setShowDrillThrough(false)}
        data={drillThroughData}
      />
    </div>
  );
};

export default FleetAnalyticsDashboard;

</edits_to_apply>
