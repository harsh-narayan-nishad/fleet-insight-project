
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock, FileX, Wrench } from 'lucide-react';
import { FleetDataService } from '@/services/fleetDataService';

const AlertsPanel = () => {
  const pendingVehicles = FleetDataService.getPendingVehicles();
  
  const alerts = [
    {
      id: 1,
      type: 'warning',
      icon: AlertTriangle,
      title: 'Vehicles Needing Service',
      count: pendingVehicles.length,
      description: `${pendingVehicles.length} vehicles require immediate attention`,
      action: 'Review Now',
      color: 'text-orange-600 bg-orange-100'
    },
    {
      id: 2,
      type: 'info',
      icon: Clock,
      title: 'Upcoming Replacements',
      count: 3,
      description: '3 vehicles scheduled for replacement in 2027',
      action: 'Plan Budget',
      color: 'text-blue-600 bg-blue-100'
    },
    {
      id: 3,
      type: 'error',
      icon: FileX,
      title: 'Missing Data',
      count: 2,
      description: '2 vehicles have incomplete information',
      action: 'Update Records',
      color: 'text-red-600 bg-red-100'
    },
    {
      id: 4,
      type: 'success',
      icon: Wrench,
      title: 'Maintenance Due',
      count: 5,
      description: '5 vehicles due for scheduled maintenance',
      action: 'Schedule',
      color: 'text-green-600 bg-green-100'
    }
  ];

  return (
    <Card className="bg-white shadow-sm border-slate-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-800">Fleet Alerts</CardTitle>
        <CardDescription>
          Items requiring immediate attention
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.map((alert) => {
            const Icon = alert.icon;
            return (
              <div key={alert.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${alert.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-slate-800">{alert.title}</span>
                      <Badge variant="secondary" className="text-xs">
                        {alert.count}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600">{alert.description}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="text-xs">
                  {alert.action}
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertsPanel;
