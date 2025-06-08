
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Filter } from 'lucide-react';
import { DrillThroughData, FleetVehicle } from '@/types/fleet';

interface DrillThroughModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: DrillThroughData | null;
}

const DrillThroughModal = ({ isOpen, onClose, data }: DrillThroughModalProps) => {
  const [sortField, setSortField] = useState<keyof FleetVehicle>('equipmentDescription');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  if (!data) return null;

  const sortedVehicles = [...data.vehicles].sort((a, b) => {
    const aVal = a[sortField] || '';
    const bVal = b[sortField] || '';
    
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    }
    
    return sortDirection === 'asc' 
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });

  const handleSort = (field: keyof FleetVehicle) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleExport = () => {
    const headers = [
      'Equipment', 'Description', 'System Status', 'LHP', 'Location', 
      'License Number', 'Start Up', 'Acquisition Value', 'LC Replace Year',
      'Replacement Cost', 'Forecast Spend', 'Radio Equipment'
    ];
    
    const csvContent = [
      headers.join(','),
      ...sortedVehicles.map(vehicle => [
        vehicle.equipment || '',
        vehicle.equipmentDescription || '',
        vehicle.systemStatus || '',
        vehicle.lhp || '',
        vehicle.location || '',
        vehicle.licenseNumber || '',
        vehicle.startUp || '',
        vehicle.acquisitionValue || '',
        vehicle.lcReplaceYear || '',
        vehicle.replacementCost2024_2035 || '',
        vehicle.forecastSpend2025_2035 || '',
        vehicle.radioEquipment || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${data.title.replace(/\s+/g, '_')}_data.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{data.title}</span>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {data.vehicles.length} vehicles
              </Badge>
              {data.totalValue && (
                <Badge variant="secondary">
                  Total Value: ${data.totalValue.toLocaleString()}
                </Badge>
              )}
            </div>
          </DialogTitle>
          <DialogDescription>
            Detailed view of selected vehicles with full field data
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between py-4 border-b">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span className="text-sm text-muted-foreground">
              Active Filters: {data.filters.map(f => `${f.field}=${f.value}`).join(', ')}
            </span>
          </div>
          <Button onClick={handleExport} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('equipment')}
                >
                  Equipment {sortField === 'equipment' && (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('equipmentDescription')}
                >
                  Description {sortField === 'equipmentDescription' && (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('systemStatus')}
                >
                  Status {sortField === 'systemStatus' && (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('lhp')}
                >
                  Class {sortField === 'lhp' && (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('location')}
                >
                  Location {sortField === 'location' && (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('acquisitionValue')}
                >
                  Acquisition Value {sortField === 'acquisitionValue' && (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('lcReplaceYear')}
                >
                  Replace Year {sortField === 'lcReplaceYear' && (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('replacementCost2024_2035')}
                >
                  Replacement Cost {sortField === 'replacementCost2024_2035' && (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedVehicles.map((vehicle) => (
                <TableRow key={vehicle.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{vehicle.equipment}</TableCell>
                  <TableCell>{vehicle.equipmentDescription}</TableCell>
                  <TableCell>
                    <Badge className={
                      vehicle.systemStatus === 'In Service' ? 'bg-green-100 text-green-800' :
                      vehicle.systemStatus === 'Running' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }>
                      {vehicle.systemStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{vehicle.lhp}</Badge>
                  </TableCell>
                  <TableCell>{vehicle.location}</TableCell>
                  <TableCell>${vehicle.acquisitionValue?.toLocaleString()}</TableCell>
                  <TableCell>{vehicle.lcReplaceYear}</TableCell>
                  <TableCell>${vehicle.replacementCost2024_2035?.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DrillThroughModal;
