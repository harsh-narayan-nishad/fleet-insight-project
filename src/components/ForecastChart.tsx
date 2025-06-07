import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { ForecastService, ForecastData } from '@/services/forecastService';

const ForecastChart = () => {
  const [data, setData] = useState<ForecastData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadForecastData();
  }, []);

  const loadForecastData = async () => {
    try {
      const forecastData = await ForecastService.generateForecast();
      setData(forecastData);
    } catch (error) {
      console.error('Error loading forecast data:', error);
      // Fallback to static data if service fails
      setData([
        { year: '2024', totalSpending: 2400000, evSpending: 340000, smallVehicles: 120, largeVehicles: 45, evVehicles: 30 },
        { year: '2025', totalSpending: 2650000, evSpending: 450000, smallVehicles: 125, largeVehicles: 47, evVehicles: 35 },
        { year: '2026', totalSpending: 2890000, evSpending: 580000 },
        { year: '2027', totalSpending: 3150000, evSpending: 730000 },
        { year: '2028', totalSpending: 3420000, evSpending: 920000 },
        { year: '2029', totalSpending: 3700000, evSpending: 1150000 },
        { year: '2030', totalSpending: 3980000, evSpending: 1420000 },
        { year: '2031', totalSpending: 4280000, evSpending: 1730000 },
        { year: '2032', totalSpending: 4590000, evSpending: 2080000 },
        { year: '2033', totalSpending: 4920000, evSpending: 2470000 },
        { year: '2034', totalSpending: 5270000, evSpending: 2900000 },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 border border-slate-200 rounded-lg p-3 shadow-lg">
          <p className="text-slate-900 font-medium mb-2">{`Year: ${label}`}</p>
          {payload.map((pld: any, index: number) => (
            <p key={index} style={{ color: pld.color }} className="text-sm">
              {`${pld.dataKey === 'totalSpending' ? 'Total Fleet Spending' : 'EV Spending'}: $${pld.value.toLocaleString()}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const formatYAxis = (value: number) => {
    return '$' + (value / 1000000).toFixed(1) + 'M';
  };

  if (isLoading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-slate-500">Loading forecast data...</div>
      </div>
    );
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <defs>
            <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="rgba(59, 130, 246, 0.1)" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="rgba(59, 130, 246, 0.1)" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="evGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="rgba(34, 197, 94, 0.1)" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="rgba(34, 197, 94, 0.1)" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
          <XAxis 
            dataKey="year" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#64748b' }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#64748b' }}
            tickFormatter={formatYAxis}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="circle"
          />
          <Area
            type="monotone"
            dataKey="totalSpending"
            stroke="rgb(59, 130, 246)"
            strokeWidth={3}
            fill="url(#totalGradient)"
            name="Total Fleet Spending"
            dot={{ fill: 'rgb(59, 130, 246)', strokeWidth: 2, stroke: 'white', r: 6 }}
          />
          <Area
            type="monotone"
            dataKey="evSpending"
            stroke="rgb(34, 197, 94)"
            strokeWidth={3}
            fill="url(#evGradient)"
            name="EV Spending"
            dot={{ fill: 'rgb(34, 197, 94)', strokeWidth: 2, stroke: 'white', r: 6 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ForecastChart;
