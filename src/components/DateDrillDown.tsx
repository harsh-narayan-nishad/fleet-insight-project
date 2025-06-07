
import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, TrendingUp, TrendingDown } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface DateDrillDownProps {
  vehicles: any[];
}

const DateDrillDown = ({ vehicles }: DateDrillDownProps) => {
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [viewType, setViewType] = useState<"replacements" | "acquisitions" | "spending">("replacements");

  const processedData = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const yearRange = Array.from({ length: 11 }, (_, i) => currentYear + i);
    
    const replacementData = yearRange.map(year => {
      const replacements = vehicles.filter(v => 
        parseInt(v.lcReplaceYear) === year
      );
      
      const totalValue = replacements.reduce((sum, v) => sum + (v.acquisitionValue || 0), 0);
      
      return {
        year: year.toString(),
        count: replacements.length,
        totalValue,
        vehicles: replacements,
        avgValue: replacements.length > 0 ? totalValue / replacements.length : 0
      };
    });

    const acquisitionData = vehicles.reduce((acc, vehicle) => {
      const year = vehicle.startUp;
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(vehicle);
      return acc;
    }, {} as Record<string, any[]>);

    return {
      replacementData: replacementData.filter(d => d.count > 0),
      acquisitionData,
      yearRange
    };
  }, [vehicles]);

  const filteredVehicles = useMemo(() => {
    if (selectedYear === "all") return vehicles;
    
    if (viewType === "replacements") {
      return vehicles.filter(v => v.lcReplaceYear === selectedYear);
    } else if (viewType === "acquisitions") {
      return vehicles.filter(v => v.startUp === selectedYear);
    }
    
    return vehicles;
  }, [vehicles, selectedYear, viewType]);

  const getChartData = () => {
    if (viewType === "replacements") {
      return processedData.replacementData.map(d => ({
        year: d.year,
        value: d.count,
        spending: d.totalValue / 1000000 // Convert to millions
      }));
    }
    
    return Object.entries(processedData.acquisitionData).map(([year, vehs]) => ({
      year,
      value: vehs.length,
      spending: vehs.reduce((sum, v) => sum + (v.acquisitionValue || 0), 0) / 1000000
    })).sort((a, b) => parseInt(a.year) - parseInt(b.year));
  };

  const chartData = getChartData();
  
  const getYearOptions = () => {
    const years = new Set<string>();
    
    if (viewType === "replacements") {
      vehicles.forEach(v => {
        if (v.lcReplaceYear) years.add(v.lcReplaceYear);
      });
    } else {
      vehicles.forEach(v => {
        if (v.startUp) years.add(v.startUp);
      });
    }
    
    return Array.from(years).sort();
  };

  const getStatsForSelectedYear = () => {
    if (selectedYear === "all") {
      return {
        totalVehicles: filteredVehicles.length,
        totalValue: filteredVehicles.reduce((sum, v) => sum + (v.acquisitionValue || 0), 0),
        categories: filteredVehicles.reduce((acc, v) => {
          acc[v.category] = (acc[v.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      };
    }

    const yearData = processedData.replacementData.find(d => d.year === selectedYear);
    if (yearData) {
      return {
        totalVehicles: yearData.count,
        totalValue: yearData.totalValue,
        avgValue: yearData.avgValue,
        categories: yearData.vehicles.reduce((acc: Record<string, number>, v: any) => {
          acc[v.category] = (acc[v.category] || 0) + 1;
          return acc;
        }, {})
      };
    }

    return { totalVehicles: 0, totalValue: 0, categories: {} };
  };

  const stats = getStatsForSelectedYear();

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
            <Select value={viewType} onValueChange={(value: any) => setViewType(value)}>
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
                {getYearOptions().map(year => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">
                {viewType === "replacements" ? "Replacement Timeline" : 
                 viewType === "acquisitions" ? "Acquisition Timeline" : "Spending Timeline"}
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'value' ? `${value} vehicles` : `$${value.toFixed(1)}M`,
                        name === 'value' ? 'Count' : 'Spending'
                      ]}
                    />
                    <Bar dataKey="value" fill="rgba(59, 130, 246, 0.8)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

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
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-2 px-3 font-semibold text-slate-700">License Plate</th>
                    <th className="text-left py-2 px-3 font-semibold text-slate-700">Category</th>
                    <th className="text-left py-2 px-3 font-semibold text-slate-700">Value</th>
                    <th className="text-left py-2 px-3 font-semibold text-slate-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVehicles.slice(0, 10).map((vehicle, index) => (
                    <tr key={index} className="border-b border-slate-100">
                      <td className="py-2 px-3 font-medium">{vehicle.licensePlate}</td>
                      <td className="py-2 px-3">
                        <Badge variant="outline">{vehicle.category}</Badge>
                      </td>
                      <td className="py-2 px-3">${vehicle.acquisitionValue?.toLocaleString()}</td>
                      <td className="py-2 px-3">
                        <Badge className={
                          vehicle.status === "In Service" ? "bg-green-100 text-green-800" : 
                          vehicle.status === "Running" ? "bg-blue-100 text-blue-800" :
                          "bg-red-100 text-red-800"
                        }>
                          {vehicle.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredVehicles.length > 10 && (
                <div className="text-center py-3 text-slate-500">
                  Showing 10 of {filteredVehicles.length} vehicles
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DateDrillDown;
