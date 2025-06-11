
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart3 } from 'lucide-react';

interface FleetInteractiveChartProps {
  data: any[];
  onChartClick: () => void;
}

const FleetInteractiveChart = ({ data, onChartClick }: FleetInteractiveChartProps) => {
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
    <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200/50 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300" onClick={onChartClick}>
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
            <LineChart data={data}>
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
  );
};

export default FleetInteractiveChart;
