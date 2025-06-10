
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ForecastChart from '@/components/ForecastChart';
import PurchaseMixChart from '@/components/PurchaseMixChart';
import InteractiveCharts from '@/components/InteractiveCharts';

const ForecastPage = () => {
  const [forecastKey] = useState(0);
  
  // Sample fleet data - in real app this would come from props or context
  const fleetData = [
    {
      id: "1",
      licensePlate: "87JD-1",
      startUp: "1992",
      acquisitionValue: 210000.00,
      lcReplaceYear: "2027",
      category: "Small",
      status: "In Service"
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-slate-900">Fleet Forecast Analysis</CardTitle>
          <CardDescription>
            Detailed 10-year projections with scenario planning
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Annual Spending Projection</h3>
              <ForecastChart key={`forecast-detail-${forecastKey}`} />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Vehicle Mix Evolution</h3>
              <PurchaseMixChart key={`mix-detail-${forecastKey}`} />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <InteractiveCharts vehicles={fleetData} />
    </div>
  );
};

export default ForecastPage;
