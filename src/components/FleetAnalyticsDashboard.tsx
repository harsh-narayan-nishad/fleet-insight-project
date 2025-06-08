import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { TrendingUp, DollarSign, Truck, Settings } from 'lucide-react';
import { FleetDataService } from '@/services/fleetDataService';
import { DrillThroughData, ChartDataPoint } from '@/types/fleet';
import DrillThroughModal from './DrillThroughModal';

const FleetAnalyticsDashboard = () => {
  const [drillThroughData, setDrillThroughData] = useState<DrillThroughData | null>(null);
  const [showDrillThrough, setShowDrillThrough] = useState(false);

  const replacementTrend = FleetDataService.getReplacementCostTrend();
  const forecastComparison = FleetDataService.getForecastSpendVsReplacement();
  const vehicleClassData = FleetDataService.getVehicleClassBreakdown();
  const radioSpendData = FleetDataService.getRadioSpendBreakdown();
  const top10Expensive = FleetDataService.getTop10MostExpensive();
  const pendingVehicles = FleetDataService.getPendingVehicles();

  const handleChartClick = (data: any, chartTitle: string) => {
    console.log('Chart clicked:', data, chartTitle);
    
    // Handle different chart click events
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

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
          <p className="font-medium">{`${label}`}</p>
          {payload.map((pld: any, index: number) => (
            <p key={index} style={{ color: pld.color }}>
              {`${pld.dataKey}: $${pld.value?.toLocaleString()}`}
            </p>
          ))}
          <p className="text-sm text-gray-500 mt-1">Click for details</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-sm font-medium">Total Fleet Value</CardDescription>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${FleetDataService.getAllVehicles()
                .reduce((sum, v) => sum + (v.acquisitionValue || 0), 0)
                .toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-sm font-medium">Active Vehicles</CardDescription>
              <Truck className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {FleetDataService.getAllVehicles()
                .filter(v => v.serviceStatus === 'ready_for_service').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-sm font-medium">Pending Service</CardDescription>
              <Settings className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {pendingVehicles.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-sm font-medium">Avg Vehicle Age</CardDescription>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(FleetDataService.getAllVehicles()
                .reduce((sum, v) => sum + (2024 - parseInt(v.startUp || '2020')), 0) / 
                FleetDataService.getAllVehicles().length)} years
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trends">Cost Trends</TabsTrigger>
          <TabsTrigger value="breakdown">Fleet Breakdown</TabsTrigger>
          <TabsTrigger value="radio">Radio Equipment</TabsTrigger>
          <TabsTrigger value="pending">Pending Vehicles</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>10-Year Replacement Cost Trend</CardTitle>
                <CardDescription>Total replacement costs by year (2025-2035)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={replacementTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#3B82F6" 
                        strokeWidth={3}
                        dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6, cursor: 'pointer' }}
                        onClick={(data) => handleChartClick(data.payload, '10-Year Replacement Cost Trend')}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Forecast vs Replacement Cost</CardTitle>
                <CardDescription>Annual comparison of forecast spend vs replacement cost</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={forecastComparison}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar 
                        dataKey="forecast" 
                        fill="#10B981" 
                        name="Forecast Spend"
                        onClick={(data) => handleChartClick(data, 'Forecast Spend')}
                        style={{ cursor: 'pointer' }}
                      />
                      <Bar 
                        dataKey="replacement" 
                        fill="#3B82F6" 
                        name="Replacement Cost"
                        onClick={(data) => handleChartClick(data, 'Replacement Cost')}
                        style={{ cursor: 'pointer' }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="breakdown" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Class Distribution</CardTitle>
                <CardDescription>Fleet composition by L.H.P categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={vehicleClassData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="count"
                        onClick={(data) => handleChartClick(data, 'Vehicle Class Distribution')}
                        style={{ cursor: 'pointer' }}
                      >
                        {vehicleClassData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top 10 Most Expensive Equipment</CardTitle>
                <CardDescription>Ranked by acquisition value</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={top10Expensive} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                      <YAxis type="category" dataKey="year" width={150} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar 
                        dataKey="value" 
                        fill="#F59E0B"
                        onClick={(data) => handleChartClick(data, 'Most Expensive Equipment')}
                        style={{ cursor: 'pointer' }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="radio" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Radio Equipment Spend by Year</CardTitle>
              <CardDescription>Radio equipment spending breakdown (2026-2035)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={radioSpendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="value" 
                      fill="#8B5CF6"
                      onClick={(data) => handleChartClick(data, 'Radio Equipment Spend')}
                      style={{ cursor: 'pointer' }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vehicles Not in Service</CardTitle>
              <CardDescription>
                {pendingVehicles.length} vehicles requiring attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingVehicles.map((vehicle) => (
                  <div key={vehicle.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{vehicle.equipment}</Badge>
                      <span className="font-medium">{vehicle.equipmentDescription}</span>
                      <Badge className="bg-red-100 text-red-800">{vehicle.systemStatus}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Replace: {vehicle.lcReplaceYear}
                    </div>
                  </div>
                ))}
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
