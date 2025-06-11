
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Filter, X, Calendar, Building2, MapPin, Truck } from 'lucide-react';

interface FiltersPanelProps {
  activeFilters: {
    yearRange: { start: number; span: number };
    lob: string;
    costCenter: string;
    vehicleType: string;
    status: string;
  };
  onFiltersChange: (filters: any) => void;
}

const FleetFiltersPanel = ({ activeFilters, onFiltersChange }: FiltersPanelProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Line of Business names as specified
  const lobOptions = [
    'Electric Operations',
    'Gas Operations', 
    'UOS',
    'Customer OPS',
    'DP&C',
    'Service Corp'
  ];

  // Placeholder cost centers - waiting for real values
  const costCenterPlaceholders = [
    'Fleet Maintenance',
    'Capital Projects', 
    'Operations Support',
    'Field Services',
    'Emergency Response'
  ];

  const vehicleTypeOptions = [
    'Light Vehicle',
    'Heavy Vehicle', 
    'Powered Equipment',
    'Electric Vehicle',
    'Specialty Equipment'
  ];

  const statusOptions = [
    'Active',
    'In Service',
    'Out of Service',
    'Retired',
    'Pending'
  ];

  const updateFilter = (key: string, value: any) => {
    const newFilters = { ...activeFilters, [key]: value };
    onFiltersChange(newFilters);
  };

  const updateYearRange = (field: 'start' | 'span', value: number) => {
    const newYearRange = { ...activeFilters.yearRange, [field]: value };
    updateFilter('yearRange', newYearRange);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      yearRange: { start: 2025, span: 10 },
      lob: 'all',
      costCenter: 'all',
      vehicleType: 'all',
      status: 'all'
    };
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = 
    activeFilters.lob !== 'all' ||
    activeFilters.costCenter !== 'all' ||
    activeFilters.vehicleType !== 'all' ||
    activeFilters.status !== 'all' ||
    activeFilters.yearRange.start !== 2025 ||
    activeFilters.yearRange.span !== 10;

  const getYearRangeLabel = () => {
    const endYear = activeFilters.yearRange.start + activeFilters.yearRange.span - 1;
    return `${activeFilters.yearRange.start}-${endYear}`;
  };

  return (
    <Card className="bg-gradient-to-r from-violet-50 to-pink-50 border-violet-200/50 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-slate-700">
            <Filter className="h-5 w-5 text-violet-500" />
            Fleet Filters
            <Badge variant="secondary" className="bg-violet-100 text-violet-700">
              {activeFilters.yearRange.span} Year View
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearAllFilters}
                className="text-slate-500 hover:text-slate-700 hover:bg-white/50"
              >
                <X className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-slate-600 hover:bg-white/50"
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4">
          {/* Year Range Selector */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-slate-200/50">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Calendar className="h-4 w-4 text-blue-500" />
                Start Year
              </label>
              <Input
                type="number"
                value={activeFilters.yearRange.start}
                onChange={(e) => updateYearRange('start', parseInt(e.target.value) || 2025)}
                className="bg-white/80 border-slate-300"
                min="2020"
                max="2050"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Year Span</label>
              <Input
                type="number"
                value={activeFilters.yearRange.span}
                onChange={(e) => updateYearRange('span', parseInt(e.target.value) || 10)}
                className="bg-white/80 border-slate-300"
                min="1"
                max="20"
              />
            </div>
            <div className="md:col-span-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                Current Range: {getYearRangeLabel()}
              </Badge>
            </div>
          </div>

          {/* Main Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Line of Business */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Building2 className="h-4 w-4 text-green-500" />
                Line of Business
              </label>
              <Select value={activeFilters.lob} onValueChange={(value) => updateFilter('lob', value)}>
                <SelectTrigger className="bg-white/80 border-slate-300 h-9">
                  <SelectValue placeholder="All LOBs" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200 shadow-lg">
                  <SelectItem value="all">All Lines of Business</SelectItem>
                  {lobOptions.map((lob) => (
                    <SelectItem key={lob} value={lob}>{lob}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Cost Center - Placeholder */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <MapPin className="h-4 w-4 text-purple-500" />
                Cost Center
                <Badge variant="outline" className="text-xs bg-amber-50 text-amber-600 border-amber-200">
                  Placeholder
                </Badge>
              </label>
              <Select value={activeFilters.costCenter} onValueChange={(value) => updateFilter('costCenter', value)}>
                <SelectTrigger className="bg-white/80 border-slate-300 h-9">
                  <SelectValue placeholder="All Cost Centers" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200 shadow-lg">
                  <SelectItem value="all">All Cost Centers</SelectItem>
                  {costCenterPlaceholders.map((center) => (
                    <SelectItem key={center} value={center}>{center}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Vehicle Type */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Truck className="h-4 w-4 text-orange-500" />
                Vehicle Type
              </label>
              <Select value={activeFilters.vehicleType} onValueChange={(value) => updateFilter('vehicleType', value)}>
                <SelectTrigger className="bg-white/80 border-slate-300 h-9">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200 shadow-lg">
                  <SelectItem value="all">All Vehicle Types</SelectItem>
                  {vehicleTypeOptions.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Status</label>
              <Select value={activeFilters.status} onValueChange={(value) => updateFilter('status', value)}>
                <SelectTrigger className="bg-white/80 border-slate-300 h-9">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200 shadow-lg">
                  <SelectItem value="all">All Status</SelectItem>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-slate-200/50">
              <span className="text-sm text-slate-600 font-medium">Active filters:</span>
              {activeFilters.lob !== 'all' && (
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  LOB: {activeFilters.lob}
                </Badge>
              )}
              {activeFilters.costCenter !== 'all' && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                  Cost Center: {activeFilters.costCenter}
                </Badge>
              )}
              {activeFilters.vehicleType !== 'all' && (
                <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                  Type: {activeFilters.vehicleType}
                </Badge>
              )}
              {activeFilters.status !== 'all' && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  Status: {activeFilters.status}
                </Badge>
              )}
              {(activeFilters.yearRange.start !== 2025 || activeFilters.yearRange.span !== 10) && (
                <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">
                  Years: {getYearRangeLabel()}
                </Badge>
              )}
            </div>
          )}

          {/* Cost Center Configuration Note */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-700">
              <strong>Note:</strong> Cost center values are placeholder. Please provide the actual cost center codes/names to populate this filter.
            </p>
          </div>

          {/* Back Coast Rule Placeholder */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Back Coast Rule:</strong> Please define which vehicles qualify for radio equipment costs 
              (e.g., specific locations, vehicle types, or other criteria) to enable radio cost calculations.
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default FleetFiltersPanel;
