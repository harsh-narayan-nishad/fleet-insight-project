
import { Badge } from "@/components/ui/badge";
import { Vehicle } from "@/types/vehicle";

interface VehicleTableProps {
  vehicles: Vehicle[];
  selectedYear: string;
}

const VehicleTable = ({ vehicles, selectedYear }: VehicleTableProps) => {
  if (selectedYear === "all") {
    return null;
  }

  return (
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
          {vehicles.slice(0, 10).map((vehicle: Vehicle, index: number) => (
            <tr key={index} className="border-b border-slate-100">
              <td className="py-2 px-3 font-medium">{vehicle.licensePlate}</td>
              <td className="py-2 px-3">
                <Badge variant="outline">{vehicle.category || 'Unknown'}</Badge>
              </td>
              <td className="py-2 px-3">${vehicle.acquisitionValue?.toLocaleString() || 'N/A'}</td>
              <td className="py-2 px-3">
                <Badge className={
                  vehicle.status === "In Service" ? "bg-green-100 text-green-800" : 
                  vehicle.status === "Running" ? "bg-blue-100 text-blue-800" :
                  "bg-red-100 text-red-800"
                }>
                  {vehicle.status || 'Unknown'}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {vehicles.length > 10 && (
        <div className="text-center py-3 text-slate-500">
          Showing 10 of {vehicles.length} vehicles
        </div>
      )}
    </div>
  );
};

export default VehicleTable;
