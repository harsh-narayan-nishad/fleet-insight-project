
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { ChartDataPoint, ViewType } from "@/types/vehicle";

interface TimelineChartProps {
  data: ChartDataPoint[];
  viewType: ViewType;
}

const TimelineChart = ({ data, viewType }: TimelineChartProps) => {
  const getTitle = () => {
    if (viewType === "replacements") return "Replacement Timeline";
    if (viewType === "acquisitions") return "Acquisition Timeline";
    return "Spending Timeline";
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">{getTitle()}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip 
              formatter={(value: unknown, name: string) => [
                name === 'value' ? `${value} vehicles` : `$${typeof value === 'number' ? value.toFixed(1) : String(value)}M`,
                name === 'value' ? 'Count' : 'Spending'
              ]}
            />
            <Bar dataKey="value" fill="rgba(59, 130, 246, 0.8)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TimelineChart;
