
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, Download, Filter, Calendar } from 'lucide-react';

const AdvancedAnalytics = () => {
  const [selectedMetric, setSelectedMetric] = useState('cost');
  const [timeframe, setTimeframe] = useState('12m');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Sample data for different analytics views
  const costTrendData = [
    { month: 'Jan', maintenance: 85000, fuel: 120000, depreciation: 45000, total: 250000 },
    { month: 'Feb', maintenance: 92000, fuel: 115000, depreciation: 45000, total: 252000 },
    { month: 'Mar', maintenance: 78000, fuel: 125000, depreciation: 45000, total: 248000 },
    { month: 'Apr', maintenance: 105000, fuel: 118000, depreciation: 45000, total: 268000 },
    { month: 'May', maintenance: 88000, fuel: 122000, depreciation: 45000, total: 255000 },
    { month: 'Jun', maintenance: 95000, fuel: 128000, depreciation: 45000, total: 268000 },
  ];

  const utilizationData = [
    { department: 'Operations', utilization: 94, target: 90, vehicles: 245 },
    { department: 'Sales', utilization: 87, target: 85, vehicles: 156 },
    { department: 'Maintenance', utilization: 78, target: 80, vehicles: 89 },
    { department: 'Administration', utilization: 65, target: 70, vehicles: 67 },
    { department: 'Emergency', utilization: 92, target: 95, vehicles: 34 },
  ];

  const performanceMetrics = [
    { category: 'Light Vehicles', efficiency: 28.5, availability: 94, cost_per_mile: 0.45 },
    { category: 'Medium Vehicles', efficiency: 18.2, availability: 91, cost_per_mile: 0.67 },
    { category: 'Heavy Vehicles', efficiency: 8.9, availability: 88, cost_per_mile: 1.23 },
    { category: 'Electric Vehicles', efficiency: 85.3, availability: 96, cost_per_mile: 0.28 },
  ];

  const maintenancePrediction = [
    { vehicle_id: 'VH-001', model: 'Ford Transit', probability: 85, days_to_service: 12, estimated_cost: 2400 },
    { vehicle_id: 'VH-045', model: 'Chevrolet Silverado', probability: 78, days_to_service: 18, estimated_cost: 1800 },
    { vehicle_id: 'VH-089', model: 'Tesla Model Y', probability: 65, days_to_service: 25, estimated_cost: 950 },
    { vehicle_id: 'VH-123', model: 'Ram ProMaster', probability: 92, days_to_service: 8, estimated_cost: 3200 },
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const exportData = (format: string) => {
    console.log(`Exporting data in ${format} format`);
    // Implementation would depend on your data export requirements
  };

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Advanced Fleet Analytics
              </CardTitle>
              <CardDescription>Comprehensive insights and predictive analytics</CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3m">Last 3 Months</SelectItem>
                  <SelectItem value="6m">Last 6 Months</SelectItem>
                  <SelectItem value="12m">Last 12 Months</SelectItem>
                  <SelectItem value="ytd">Year to Date</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={() => exportData('excel')}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="trends">Cost Trends</TabsTrigger>
          <TabsTrigger value="utilization">Utilization</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="predictive">Predictive</TabsTrigger>
          <TabsTrigger value="sustainability">Sustainability</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Cost Breakdown Trends</CardTitle>
                <CardDescription>Monthly cost analysis by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={costTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `$${(value/1000).toFixed(0)}K`} />
                      <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, '']} />
                      <Legend />
                      <Area type="monotone" dataKey="maintenance" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="fuel" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="depreciation" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Total Cost Trend</CardTitle>
                <CardDescription>Overall fleet cost performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={costTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `$${(value/1000).toFixed(0)}K`} />
                      <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Total Cost']} />
                      <Line type="monotone" dataKey="total" stroke="#EF4444" strokeWidth={3} dot={{ fill: '#EF4444', strokeWidth: 2, r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="utilization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Department Utilization Analysis</CardTitle>
              <CardDescription>Vehicle utilization vs targets by department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={utilizationData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="utilization" fill="#3B82F6" name="Current Utilization %" />
                    <Bar dataKey="target" fill="#10B981" name="Target %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics by Category</CardTitle>
              <CardDescription>Efficiency, availability, and cost performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">Category</th>
                      <th className="text-left py-3 px-4 font-semibold">Efficiency</th>
                      <th className="text-left py-3 px-4 font-semibold">Availability</th>
                      <th className="text-left py-3 px-4 font-semibold">Cost per Mile</th>
                      <th className="text-left py-3 px-4 font-semibold">Performance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {performanceMetrics.map((metric, index) => (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">{metric.category}</td>
                        <td className="py-3 px-4">
                          {metric.category === 'Electric Vehicles' ? `${metric.efficiency} MPGe` : `${metric.efficiency} MPG`}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span>{metric.availability}%</span>
                            <Badge variant={metric.availability >= 90 ? 'default' : 'secondary'}>
                              {metric.availability >= 90 ? 'Good' : 'Needs Attention'}
                            </Badge>
                          </div>
                        </td>
                        <td className="py-3 px-4">${metric.cost_per_mile}</td>
                        <td className="py-3 px-4">
                          <Badge variant={
                            metric.availability >= 90 && metric.cost_per_mile < 0.5 ? 'default' : 
                            metric.availability >= 85 ? 'secondary' : 'destructive'
                          }>
                            {metric.availability >= 90 && metric.cost_per_mile < 0.5 ? 'Excellent' : 
                             metric.availability >= 85 ? 'Good' : 'Poor'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictive" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Predictive Maintenance Alerts</CardTitle>
              <CardDescription>AI-powered maintenance predictions and cost estimates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {maintenancePrediction.map((prediction, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="font-semibold">{prediction.vehicle_id}</div>
                        <div className="text-sm text-muted-foreground">{prediction.model}</div>
                      </div>
                      <Badge variant={
                        prediction.probability >= 80 ? 'destructive' : 
                        prediction.probability >= 65 ? 'secondary' : 'outline'
                      }>
                        {prediction.probability}% Risk
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{prediction.days_to_service} days</div>
                      <div className="text-sm text-muted-foreground">Est. ${prediction.estimated_cost.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sustainability" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Carbon Footprint Trends</CardTitle>
                <CardDescription>Monthly CO2 emissions tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[
                      { month: 'Jan', emissions: 450 },
                      { month: 'Feb', emissions: 420 },
                      { month: 'Mar', emissions: 380 },
                      { month: 'Apr', emissions: 365 },
                      { month: 'May', emissions: 340 },
                      { month: 'Jun', emissions: 325 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} tons CO2`, 'Emissions']} />
                      <Line type="monotone" dataKey="emissions" stroke="#10B981" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>EV Adoption Progress</CardTitle>
                <CardDescription>Electric vehicle transition status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Current EV Fleet</span>
                    <span className="font-semibold">123 vehicles (16%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>2024 Target</span>
                    <span className="font-semibold">200 vehicles (26%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>2030 Goal</span>
                    <span className="font-semibold">500 vehicles (65%)</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress to 2024 Target</span>
                      <span>62%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '62%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAnalytics;
