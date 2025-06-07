
import { Badge } from "@/components/ui/badge";
import { YearStats } from "@/types/vehicle";

interface StatsSummaryProps {
  stats: YearStats;
  selectedYear: string;
}

const StatsSummary = ({ stats, selectedYear }: StatsSummaryProps) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">
        {selectedYear === "all" ? "Overall Statistics" : `${selectedYear} Details`}
      </h3>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-700">{stats.totalVehicles}</div>
            <div className="text-sm text-slate-600">Vehicles</div>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-700">
              ${(stats.totalValue / 1000000).toFixed(1)}M
            </div>
            <div className="text-sm text-slate-600">Total Value</div>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Category Breakdown</h4>
          <div className="space-y-2">
            {Object.entries(stats.categories).map(([category, count]) => (
              <div key={category} className="flex justify-between items-center">
                <span className="text-sm">{category}</span>
                <Badge variant="outline">{count}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsSummary;
