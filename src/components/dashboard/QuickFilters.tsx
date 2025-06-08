
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Filter, X } from 'lucide-react';

interface QuickFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
}

interface FilterState {
  yearRange: string;
  vehicleClass: string;
  location: string;
  status: string;
}

const QuickFilters = ({ onFiltersChange }: QuickFiltersProps) => {
  const [filters, setFilters] = useState<FilterState>({
    yearRange: 'all',
    vehicleClass: 'all',
    location: 'all',
    status: 'all'
  });

  const updateFilter = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      yearRange: 'all',
      vehicleClass: 'all',
      location: 'all',
      status: 'all'
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== 'all');

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-slate-600" />
          <span className="font-medium text-slate-800">Quick Filters</span>
        </div>
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="text-slate-500 hover:text-slate-700"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Year Range</label>
          <Select value={filters.yearRange} onValueChange={(value) => updateFilter('yearRange', value)}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="All Years" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              <SelectItem value="2024-2027">2024-2027</SelectItem>
              <SelectItem value="2028-2030">2028-2030</SelectItem>
              <SelectItem value="2031-2035">2031-2035</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Vehicle Class</label>
          <Select value={filters.vehicleClass} onValueChange={(value) => updateFilter('vehicleClass', value)}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="All Classes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              <SelectItem value="Light Vehicle">Light Vehicle</SelectItem>
              <SelectItem value="Heavy Vehicle">Heavy Vehicle</SelectItem>
              <SelectItem value="Powered">Powered Equipment</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Location</label>
          <Select value={filters.location} onValueChange={(value) => updateFilter('location', value)}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="Station 1">Station 1</SelectItem>
              <SelectItem value="Station 2">Station 2</SelectItem>
              <SelectItem value="Station 3">Station 3</SelectItem>
              <SelectItem value="Maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Status</label>
          <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="In Service">In Service</SelectItem>
              <SelectItem value="Running">Running</SelectItem>
              <SelectItem value="DIE">Out of Service</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-slate-200">
          <span className="text-sm text-slate-600">Active filters:</span>
          {Object.entries(filters).map(([key, value]) => 
            value !== 'all' && (
              <Badge key={key} variant="secondary" className="text-xs">
                {key}: {value}
              </Badge>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default QuickFilters;
