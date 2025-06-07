
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface InteractiveChartsProps {
  vehicles: any[];
}

const InteractiveCharts = ({ vehicles }: InteractiveChartsProps) => {
  const [selectedSegment, setSelectedSegment] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  const categoryData = vehicles.reduce((acc, vehicle) => {
    const category = vehicle.category || 'Unknown';
    if (!acc[category]) {
      acc[category] = {
        name: category,
        value: 0,
        vehicles: [],
        totalValue: 0,
        avgAge: 0
      };
    }
    acc[category].value += 1;
    acc[category].vehicles.push(vehicle);
    acc[category].totalValue += vehicle.acquisitionValue || 0;
    return acc;
  }, {} as Record<string, any>);

  // Calculate average age for each category
  Object.values(categoryData).forEach((category: any) => {
    const currentYear = new Date().getFullYear();
    const totalAge = category.vehicles.reduce((sum: number, vehicle: any) => {
      const startYear = parseInt(vehicle.startUp) || currentYear;
      return sum + (currentYear - startYear);
    }, 0);
    category.avgAge = totalAge / category.vehicles.length;
  });

  const pieData = Object.values(categoryData).map((category: any, index) => ({
    ...category,
    color: index === 0 ? 'rgba(59, 130, 246, 0.8)' : 
           index === 1 ? 'rgba(147, 51, 234, 0.8)' : 
           'rgba(34, 197, 94, 0.8)'
  }));

  const statusData = vehicles.reduce((acc, vehicle) => {
    const status = vehicle.status || 'Unknown';
    if (!acc[status]) {
      acc[status] = { name: status, value: 0, vehicles: [] };
    }
    acc[status].value += 1;
    acc[status].vehicles.push(vehicle);
    return acc;
  }, {} as Record<string, any>);

  const barData = Object.values(statusData);

  const handlePieClick = (data: any) => {
    setSelectedSegment(data);
    setShowDetails(true);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/95 border border-slate-200 rounded-lg p-3 shadow-lg">
          <p className="text-slate-900 font-medium">{data.name}</p>
          <p className="text-slate-600">{`Vehicles: ${data.value}`}</p>
          <p className="text-slate-600">{`Total Value: $${(data.totalValue / 1000000).toFixed(1)}M`}</p>
          <p className="text-slate-600">{`Avg Age: ${data.avgAge?.toFixed(1)} years`}</p>
          <p className="text-xs text-slate-500 mt-1">Click for details</p>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">
          <CardHeader>
            <CardTitle>Fleet Composition</CardTitle>
            <CardDescription>Click on segments for detailed breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    onClick={handlePieClick}
                    className="cursor-pointer"
                  >
                    {pieData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color}
                        stroke="#fff"
                        strokeWidth={2}
                        className="hover:opacity-80 transition-opacity"
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">
          <CardHeader>
            <CardTitle>Vehicle Status Distribution</CardTitle>
            <CardDescription>Current operational status breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${value} vehicles`, 'Count']}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="rgba(59, 130, 246, 0.8)"
                    onClick={(data) => {
                      setSelectedSegment(data);
                      setShowDetails(true);
                    }}
                    className="cursor-pointer"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedSegment?.name} - Detailed View
            </DialogTitle>
            <DialogDescription>
              Comprehensive breakdown of {selectedSegment?.value} vehicles in this category
            </DialogDescription>
          </DialogHeader>
          
          {selectedSegment && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-700">{selectedSegment.value}</div>
                  <div className="text-sm text-slate-600">Total Vehicles</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-700">
                    ${(selectedSegment.totalValue / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-sm text-slate-600">Total Value</div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-700">
                    ${(selectedSegment.totalValue / selectedSegment.value / 1000).toFixed(0)}K
                  </div>
                  <div className="text-sm text-slate-600">Avg Value</div>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-700">
                    {selectedSegment.avgAge?.toFixed(1)}
                  </div>
                  <div className="text-sm text-slate-600">Avg Age (years)</div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Vehicle List</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-2 px-3 font-semibold text-slate-700">License Plate</th>
                        <th className="text-left py-2 px-3 font-semibold text-slate-700">Start Year</th>
                        <th className="text-left py-2 px-3 font-semibold text-slate-700">Value</th>
                        <th className="text-left py-2 px-3 font-semibold text-slate-700">Replace Year</th>
                        <th className="text-left py-2 px-3 font-semibold text-slate-700">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedSegment.vehicles?.map((vehicle: any, index: number) => (
                        <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-2 px-3 font-medium">{vehicle.licensePlate}</td>
                          <td className="py-2 px-3">{vehicle.startUp}</td>
                          <td className="py-2 px-3">${vehicle.acquisitionValue?.toLocaleString()}</td>
                          <td className="py-2 px-3">{vehicle.lcReplaceYear}</td>
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
                </div>
              </div>

              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setShowDetails(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InteractiveCharts;
