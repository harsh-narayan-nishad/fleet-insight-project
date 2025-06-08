
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, DollarSign, Truck, Battery, AlertTriangle } from 'lucide-react';

interface ExecutiveMetric {
  label: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  color: 'green' | 'red' | 'blue' | 'yellow';
}

const ExecutiveDashboard = () => {
  const [timeframe, setTimeframe] = useState('YTD');

  const metrics: ExecutiveMetric[] = [
    {
      label: 'Total Fleet Value',
      value: '$24.8M',
      change: 8.2,
      trend: 'up',
      color: 'green'
    },
    {
      label: 'Operating Efficiency',
      value: '94.2%',
      change: 2.1,
      trend: 'up',
      color: 'blue'
    },
    {
      label: 'Maintenance Costs',
      value: '$1.2M',
      change: -5.3,
      trend: 'down',
      color: 'green'
    },
    {
      label: 'EV Transition',
      value: '28%',
      change: 12.5,
      trend: 'up',
      color: 'green'
    }
  ];

  const kpis = [
    { name: 'Fleet Utilization', current: 87, target: 90, unit: '%' },
    { name: 'Fuel Efficiency', current: 8.2, target: 8.5, unit: 'MPG' },
    { name: 'Maintenance Schedule Compliance', current: 94, target: 95, unit: '%' },
    { name: 'EV Adoption Rate', current: 28, target: 35, unit: '%' }
  ];

  const riskAlerts = [
    { type: 'High', message: '12 vehicles due for critical maintenance', severity: 'destructive' },
    { type: 'Medium', message: 'Fuel costs 15% above budget', severity: 'secondary' },
    { type: 'Low', message: '3 EVs charging infrastructure needed', severity: 'outline' }
  ];

  return (
    <div className="space-y-6">
      {/* Executive Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardDescription className="text-sm font-medium">{metric.label}</CardDescription>
                {metric.trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : metric.trend === 'down' ? (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                ) : (
                  <div className="h-4 w-4" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className={`text-sm flex items-center ${
                metric.change > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.change > 0 ? '+' : ''}{metric.change}% vs last period
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* KPI Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Key Performance Indicators
          </CardTitle>
          <CardDescription>Performance against strategic targets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {kpis.map((kpi, index) => (
              <div key={index} className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{kpi.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {kpi.current}{kpi.unit} / {kpi.target}{kpi.unit}
                  </span>
                </div>
                <Progress 
                  value={(kpi.current / kpi.target) * 100} 
                  className="h-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Current: {kpi.current}{kpi.unit}</span>
                  <span>Target: {kpi.target}{kpi.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Risk Management & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Risk Alerts
            </CardTitle>
            <CardDescription>Active issues requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {riskAlerts.map((alert, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant={alert.severity as any}>{alert.type} Risk</Badge>
                    <span className="text-sm">{alert.message}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Battery className="h-5 w-5" />
              Sustainability Metrics
            </CardTitle>
            <CardDescription>Environmental impact tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Carbon Footprint Reduction</span>
                <span className="font-semibold text-green-600">-18.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Fuel Consumption</span>
                <span className="font-semibold">2.4M gallons</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">EV Miles Driven</span>
                <span className="font-semibold text-green-600">1.2M miles</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Renewable Energy Usage</span>
                <span className="font-semibold">34%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fleet Composition Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Fleet Composition & Status
          </CardTitle>
          <CardDescription>Current fleet breakdown and operational status</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="composition" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="composition">Composition</TabsTrigger>
              <TabsTrigger value="status">Operational Status</TabsTrigger>
              <TabsTrigger value="lifecycle">Lifecycle</TabsTrigger>
            </TabsList>
            
            <TabsContent value="composition" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">487</div>
                  <div className="text-sm text-muted-foreground">Light Vehicles</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">156</div>
                  <div className="text-sm text-muted-foreground">Heavy Vehicles</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">123</div>
                  <div className="text-sm text-muted-foreground">Electric Vehicles</div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="status" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">689</div>
                  <div className="text-sm text-muted-foreground">Active</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">45</div>
                  <div className="text-sm text-muted-foreground">Maintenance</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-red-600">12</div>
                  <div className="text-sm text-muted-foreground">Out of Service</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">20</div>
                  <div className="text-sm text-muted-foreground">Reserved</div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="lifecycle" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">234</div>
                  <div className="text-sm text-muted-foreground">New (0-2 years)</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">345</div>
                  <div className="text-sm text-muted-foreground">Mid-life (3-7 years)</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">187</div>
                  <div className="text-sm text-muted-foreground">Replacement Due</div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExecutiveDashboard;
