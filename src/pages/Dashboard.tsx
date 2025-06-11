
import { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import QuickFilters from '@/components/dashboard/QuickFilters';
import AlertsPanel from '@/components/dashboard/AlertsPanel';
import { Outlet } from 'react-router-dom';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("fleet-analytics");
  const [currentUser] = useState("Fleet Manager");
  const [lastUpdated] = useState("2024-06-11");
  const [dataQualityScore] = useState(95);

  const handleFiltersChange = (filters: any) => {
    console.log('Filters changed:', filters);
  };

  const handleExport = () => {
    console.log('Exporting data...');
  };

  const handleLogout = () => {
    console.log('Logging out...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="flex-1 flex flex-col">
        <TopBar 
          userName={currentUser}
          lastUpdated={lastUpdated}
          dataQualityScore={dataQualityScore}
          onExport={handleExport}
          onLogout={handleLogout}
        />

        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            <QuickFilters onFiltersChange={handleFiltersChange} />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <Outlet />
              </div>
              <div className="lg:col-span-1">
                <AlertsPanel />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
