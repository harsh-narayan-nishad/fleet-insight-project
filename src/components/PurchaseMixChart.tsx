
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const PurchaseMixChart = () => {
  const data = [
    { name: 'Small Vehicles', value: 520, color: 'rgba(59, 130, 246, 0.8)' },
    { name: 'Large Vehicles', value: 207, color: 'rgba(147, 51, 234, 0.8)' },
    { name: 'Electric Vehicles', value: 120, color: 'rgba(34, 197, 94, 0.8)' },
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = ((data.value / total) * 100).toFixed(1);
      return (
        <div className="bg-white/95 border border-slate-200 rounded-lg p-3 shadow-lg">
          <p className="text-slate-900 font-medium">{`${data.name}: ${data.value} (${percentage}%)`}</p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex justify-center items-center space-x-6 mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            ></div>
            <span className="text-xs text-slate-600">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PurchaseMixChart;
