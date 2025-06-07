
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const VehicleInventory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Sample data based on the Excel structure
  const vehicles = [
    {
      id: 1,
      licensePlate: "87JD-1",
      startUp: "1992",
      acquisitionValue: 210000.00,
      lifeCycle: 21,
      depYears: 14,
      lcReplaceDate: "7/30/2013",
      financeAdjustment: 14,
      lcReplaceYear: "2027",
      category: "Small",
      status: "In Service"
    },
    {
      id: 2,
      licensePlate: "13GT-5",
      startUp: "1992",
      acquisitionValue: 210000.00,
      lifeCycle: 21,
      depYears: 14,
      lcReplaceDate: "7/31/2013",
      financeAdjustment: 16,
      lcReplaceYear: "2029",
      category: "Small",
      status: "In Service"
    },
    {
      id: 3,
      licensePlate: "TAC48X",
      startUp: "2004",
      acquisitionValue: 4200.00,
      lifeCycle: 21,
      depYears: 14,
      lcReplaceDate: "9/10/2025",
      financeAdjustment: 4,
      lcReplaceYear: "2029",
      category: "Small",
      status: "Running"
    },
    {
      id: 4,
      licensePlate: "NO PLATE",
      startUp: "1970",
      acquisitionValue: 150000.00,
      lifeCycle: 25,
      depYears: 14,
      lcReplaceDate: "1/30/1995",
      financeAdjustment: 32,
      lcReplaceYear: "2027",
      category: "Big",
      status: "DIE"
    },
    {
      id: 5,
      licensePlate: "XR989A",
      startUp: "2009",
      acquisitionValue: 258215.34,
      lifeCycle: 11,
      depYears: 14,
      lcReplaceDate: "9/21/2020",
      financeAdjustment: 9,
      lcReplaceYear: "2029",
      category: "EV",
      status: "In Service"
    }
  ];

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || vehicle.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      "In Service": "bg-green-100 text-green-800",
      "Running": "bg-blue-100 text-blue-800",
      "DIE": "bg-red-100 text-red-800",
      "Not in Service": "bg-gray-100 text-gray-800"
    };
    return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800";
  };

  const getCategoryBadge = (category: string) => {
    const variants = {
      "Small": "bg-blue-100 text-blue-800",
      "Big": "bg-purple-100 text-purple-800",
      "EV": "bg-green-100 text-green-800"
    };
    return variants[category as keyof typeof variants] || "bg-gray-100 text-gray-800";
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">
      <CardHeader>
        <CardTitle className="text-slate-900">Vehicle Inventory</CardTitle>
        <CardDescription>
          Current fleet status and detailed vehicle information
        </CardDescription>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Input
            placeholder="Search by license plate or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="In Service">In Service</SelectItem>
              <SelectItem value="Running">Running</SelectItem>
              <SelectItem value="DIE">DIE</SelectItem>
              <SelectItem value="Not in Service">Not in Service</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-2 font-semibold text-slate-700">License Plate</th>
                <th className="text-left py-3 px-2 font-semibold text-slate-700">Category</th>
                <th className="text-left py-3 px-2 font-semibold text-slate-700">Status</th>
                <th className="text-left py-3 px-2 font-semibold text-slate-700">Start Year</th>
                <th className="text-left py-3 px-2 font-semibold text-slate-700">Acquisition Value</th>
                <th className="text-left py-3 px-2 font-semibold text-slate-700">Life Cycle</th>
                <th className="text-left py-3 px-2 font-semibold text-slate-700">Replace Date</th>
                <th className="text-left py-3 px-2 font-semibold text-slate-700">Replace Year</th>
              </tr>
            </thead>
            <tbody>
              {filteredVehicles.map((vehicle) => (
                <tr key={vehicle.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-2 font-medium text-slate-900">{vehicle.licensePlate}</td>
                  <td className="py-3 px-2">
                    <Badge className={getCategoryBadge(vehicle.category)}>
                      {vehicle.category}
                    </Badge>
                  </td>
                  <td className="py-3 px-2">
                    <Badge className={getStatusBadge(vehicle.status)}>
                      {vehicle.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-2 text-slate-600">{vehicle.startUp}</td>
                  <td className="py-3 px-2 text-slate-600">${vehicle.acquisitionValue.toLocaleString()}</td>
                  <td className="py-3 px-2 text-slate-600">{vehicle.lifeCycle} years</td>
                  <td className="py-3 px-2 text-slate-600">{vehicle.lcReplaceDate}</td>
                  <td className="py-3 px-2 text-slate-600">{vehicle.lcReplaceYear}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredVehicles.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              No vehicles found matching your criteria.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleInventory;
