
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "lucide-react";
import { DateDrillDownProps, ViewType } from "@/types/vehicle";
import { useDateDrillDownData } from "@/hooks/useDateDrillDownData";
import TimelineChart from "./TimelineChart";
import StatsSummary from "./StatsSummary";
import VehicleTable from "./VehicleTable";

const DateDrillDown = ({ vehicles }: DateDrillDownProps) => {
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [viewType, setViewType] = useState<ViewType>("replacements");

  const { filteredVehicles, chartData, yearOptions, stats } = useDateDrillDownData(
    vehicles, 
    selectedYear, 
    viewType
  );

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Fleet Timeline Analysis
          </CardTitle>
          <CardDescription>
            Analyze fleet data by time periods and drill down into specific years
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Select value={viewType} onValueChange={(value: ViewType) => setViewType(value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select view type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="replacements">Replacement Schedule</SelectItem>
                <SelectItem value="acquisitions">Acquisition History</SelectItem>
                <SelectItem value="spending">Spending Analysis</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {yearOptions.map(year => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TimelineChart data={chartData} viewType={viewType} />
            <StatsSummary stats={stats} selectedYear={selectedYear} />
          </div>
        </CardContent>
      </Card>

      {selectedYear !== "all" && (
        <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">
          <CardHeader>
            <CardTitle>{selectedYear} Vehicle Details</CardTitle>
            <CardDescription>
              Detailed view of vehicles for the selected year
            </CardDescription>
          </CardHeader>
          <CardContent>
            <VehicleTable vehicles={filteredVehicles} selectedYear={selectedYear} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DateDrillDown;
