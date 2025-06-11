
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DrillThroughData } from '@/types/fleet';
import DrillThroughModal from './DrillThroughModal';
import FleetFiltersPanel from './FleetFiltersPanel';
import FleetTabsContent from './fleet/FleetTabsContent';

const FleetAnalyticsDashboard = () => {
  const [drillThroughData, setDrillThroughData] = useState<DrillThroughData | null>(null);
  const [showDrillThrough, setShowDrillThrough] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    yearRange: { start: 2025, span: 10 },
    lob: 'all',
    costCenter: 'all',
    vehicleType: 'all',
    status: 'all'
  });

  const handleChartClick = (data: any, chartTitle: string) => {
    console.log('Chart clicked:', data, chartTitle);
    
    if (data && data.rawData && data.rawData.length > 0) {
      const totalValue = data.rawData.reduce((sum, vehicle) => 
        sum + (vehicle.acquisitionValue || 0), 0
      );
      
      setDrillThroughData({
        title: `${chartTitle} - ${data.year || data.category || 'Selected Data'}`,
        filters: [
          { field: 'lcReplaceYear', value: data.year },
        ],
        vehicles: data.rawData,
        totalValue,
        totalCount: data.rawData.length
      });
      setShowDrillThrough(true);
    }
  };

  const handleFiltersChange = (newFilters: any) => {
    setActiveFilters(newFilters);
    console.log('Filters updated:', newFilters);
  };

  return (
    <div className="space-y-6">
      {/* Filters Panel */}
      <FleetFiltersPanel 
        activeFilters={activeFilters}
        onFiltersChange={handleFiltersChange}
      />

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-gradient-to-r from-violet-100 to-pink-100 p-1 rounded-xl">
          <TabsTrigger 
            value="overview" 
            className="data-[state=active]:bg-white data-[state=active]:text-violet-700 data-[state=active]:shadow-sm rounded-lg px-6 py-2"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="radio" 
            className="data-[state=active]:bg-white data-[state=active]:text-violet-700 data-[state=active]:shadow-sm rounded-lg px-6 py-2"
          >
            Radio Equipment
          </TabsTrigger>
          <TabsTrigger 
            value="executive" 
            className="data-[state=active]:bg-white data-[state=active]:text-violet-700 data-[state=active]:shadow-sm rounded-lg px-6 py-2"
          >
            Executive
          </TabsTrigger>
          <TabsTrigger 
            value="forecasts" 
            className="data-[state=active]:bg-white data-[state=active]:text-violet-700 data-[state=active]:shadow-sm rounded-lg px-6 py-2"
          >
            Forecasts
          </TabsTrigger>
          <TabsTrigger 
            value="vehicles" 
            className="data-[state=active]:bg-white data-[state=active]:text-violet-700 data-[state=active]:shadow-sm rounded-lg px-6 py-2"
          >
            Vehicles
          </TabsTrigger>
          <TabsTrigger 
            value="reports" 
            className="data-[state=active]:bg-white data-[state=active]:text-violet-700 data-[state=active]:shadow-sm rounded-lg px-6 py-2"
          >
            Reports
          </TabsTrigger>
          <TabsTrigger 
            value="timeline" 
            className="data-[state=active]:bg-white data-[state=active]:text-violet-700 data-[state=active]:shadow-sm rounded-lg px-6 py-2"
          >
            Timeline
          </TabsTrigger>
          <TabsTrigger 
            value="settings" 
            className="data-[state=active]:bg-white data-[state=active]:text-violet-700 data-[state=active]:shadow-sm rounded-lg px-6 py-2"
          >
            Settings
          </TabsTrigger>
        </TabsList>

        <FleetTabsContent onChartClick={handleChartClick} />
      </Tabs>

      <DrillThroughModal 
        isOpen={showDrillThrough}
        onClose={() => setShowDrillThrough(false)}
        data={drillThroughData}
      />
    </div>
  );
};

export default FleetAnalyticsDashboard;
