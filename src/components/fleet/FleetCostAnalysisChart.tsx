
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign } from 'lucide-react';

interface FleetCostAnalysisChartProps {
  data: any[];
  onChartClick: (data: any, chartTitle: string) => void;
}

const FleetCostAnalysisChart = ({ data, onChartClick }: FleetCostAnalysisChartProps) => {
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

  return (
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
                <BarChart data={data} layout="horizontal">
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
                    onClick={(data) => onChartClick(data, 'Most Expensive Equipment')}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default FleetCostAnalysisChart;
