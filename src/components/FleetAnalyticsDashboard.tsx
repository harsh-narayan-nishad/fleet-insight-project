import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { TrendingUp, DollarSign, Filter, Calendar, BarChart3, ArrowUpRight } from 'lucide-react';
import { FleetDataService } from '@/services/fleetDataService';
import { DrillThroughData, ChartDataPoint } from '@/types/fleet';
import DrillThroughModal from './DrillThroughModal';
import FleetFiltersPanel from './FleetFiltersPanel';
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
    let spending = 0;
    
    // Create realistic spending pattern based on the images
    if (year === 2026) spending = 13000000;
    else if (year === 2027) spending = 14500000;
    else if (year === 2028) spending = 16800000;
    else if (year === 2029) spending = 16200000;
    else if (year === 2030) spending = 18500000;
    else if (year === 2031) spending = 17800000;
    else if (year === 2032) spending = 19200000;
    else if (year === 2033) spending = 17500000;
    else if (year === 2034) spending = 18800000;
    else spending = 12000000; // 2025
    
    return {
      year: year.toString(),
      spending: spending,
      vehicleCount: year === 2030 ? 1 : 0, // Based on image data
      rawData: top10Expensive
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
    navigate('/advanced-analytics');
  };

  const handleFiltersChange = (newFilters: any) => {
    setActiveFilters(newFilters);
    console.log('Filters updated:', newFilters);
  };

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
          <p className="text-sm text-blue-500 mt-1 font-medium">🔗 Click to explore detailed analytics</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Filters Panel */}
      <FleetFiltersPanel 
        activeFilters={activeFilters}
        onFiltersChange={handleFiltersChange}
      />

      {/* Main Tab Navigation */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-gray-100 p-1 rounded-lg w-full justify-start">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Overview
          </TabsTrigger>
          <TabsTrigger value="radio" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Radio Equipment
          </TabsTrigger>
          <TabsTrigger value="executive" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Executive
          </TabsTrigger>
          <TabsTrigger value="forecasts" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Forecasts
          </TabsTrigger>
          <TabsTrigger value="vehicles" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Vehicles
          </TabsTrigger>
          <TabsTrigger value="reports" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Reports
          </TabsTrigger>
          <TabsTrigger value="timeline" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Timeline
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                  Total Vehicles
                  <ArrowUpRight className="h-4 w-4 text-gray-400" />
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-gray-500 mt-1">In replacement schedule</p>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                  10-Year Total
                  <ArrowUpRight className="h-4 w-4 text-gray-400" />
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-2xl font-bold">$0.3M</div>
                <p className="text-xs text-gray-500 mt-1">Including inflation estimates</p>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                  Next Year (2025)
                  <ArrowUpRight className="h-4 w-4 text-gray-400" />
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-gray-500 mt-1">Vehicles scheduled</p>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                  Radio Equipment
                  <ArrowUpRight className="h-4 w-4 text-gray-400" />
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-2xl font-bold">$0.0M</div>
                <p className="text-xs text-gray-500 mt-1">Additional spend (2026-2035)</p>
              </CardContent>
            </Card>
          </div>

          {/* Fleet Spending Trends Chart */}
          <Card className="bg-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <BarChart3 className="h-5 w-5 text-blue-500" />
                    Fleet Spending Trends
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    10-year fleet spending forecast - Click to explore detailed analytics
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  Interactive
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80 cursor-pointer" onClick={handleInteractiveChartClick}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={yearlySpendingData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="year" 
                      stroke="#64748b"
                      fontSize={12}
                    />
                    <YAxis 
                      tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`}
                      stroke="#64748b"
                      fontSize={12}
                    />
                    <Tooltip content={<InteractiveTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="spending" 
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: '#ffffff' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700 font-medium">
                  💡 Click anywhere on this chart to open the detailed analytics dashboard
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="radio" className="space-y-6">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Radio Equipment</CardTitle>
              <CardDescription>Radio equipment spend analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-8 text-center">
                <p className="text-gray-500">Radio Equipment tab content coming in next phase...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="executive" className="space-y-6">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Executive Dashboard</CardTitle>
              <CardDescription>High-level fleet overview and KPIs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-8 text-center">
                <p className="text-gray-500">Executive tab content coming in next phase...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forecasts" className="space-y-6">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Fleet Forecasts</CardTitle>
              <CardDescription>Replacement forecasting and budget planning</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-8 text-center">
                <p className="text-gray-500">Forecasts tab content coming in next phase...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vehicles" className="space-y-6">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Vehicle Management</CardTitle>
              <CardDescription>Fleet inventory and lifecycle management</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-8 text-center">
                <p className="text-gray-500">Vehicles tab content coming in next phase...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Reports & Analytics</CardTitle>
              <CardDescription>Export and detailed reporting</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-8 text-center">
                <p className="text-gray-500">Reports tab content coming in next phase...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Timeline View</CardTitle>
              <CardDescription>Vehicle replacement timeline and scheduling</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-8 text-center">
                <p className="text-gray-500">Timeline tab content coming in next phase...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Settings & Configuration</CardTitle>
              <CardDescription>Reference data and system configuration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-8 text-center">
                <p className="text-gray-500">Settings tab content coming in next phase...</p>
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
