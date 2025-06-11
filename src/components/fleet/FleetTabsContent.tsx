
import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import FleetOverviewTab from './FleetOverviewTab';

interface FleetTabsContentProps {
  onChartClick: (data: any, chartTitle: string) => void;
}

const FleetTabsContent = ({ onChartClick }: FleetTabsContentProps) => {
  return (
    <>
      <TabsContent value="overview" className="space-y-6">
        <FleetOverviewTab onChartClick={onChartClick} />
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
        <Card className="bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200/50">
          <CardHeader>
            <CardTitle className="text-slate-700">Reports & Analytics</CardTitle>
            <CardDescription className="text-slate-600">
              Export and detailed reporting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-8 text-center">
              <p className="text-slate-500">Reports tab content coming in next phase...</p>
            </div>
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
    </>
  );
};

export default FleetTabsContent;
