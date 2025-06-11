
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Dashboard from '@/pages/Dashboard';
import Index from '@/pages/Index';
import FleetAnalyticsPage from '@/pages/FleetAnalyticsPage';
import TimelinePage from '@/pages/TimelinePage';
import InventoryPage from '@/pages/InventoryPage';
import EquipmentPage from '@/pages/EquipmentPage';
import ForecastingPage from '@/pages/ForecastingPage';
import ParametersPage from '@/pages/ParametersPage';
import ForecastPage from '@/pages/ForecastPage';
import ReportsPage from '@/pages/ReportsPage';
import ExecutivePage from '@/pages/ExecutivePage';
import NotFound from '@/pages/NotFound';
import './App.css';

function App() {
  const [currentUser] = useState("Admin User");
  const [lastUpdated] = useState(new Date().toLocaleString());
  const [dataQualityScore] = useState(94);

  const handleExport = () => {
    console.log('Exporting data...');
  };

  const handleLogout = () => {
    console.log('Logging out...');
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route 
            path="/*" 
            element={
              <Dashboard
                currentUser={currentUser}
                lastUpdated={lastUpdated}
                dataQualityScore={dataQualityScore}
                onExport={handleExport}
                onLogout={handleLogout}
              />
            }
          >
            <Route path="fleet-analytics" element={<FleetAnalyticsPage />} />
            <Route path="timeline" element={<TimelinePage />} />
            <Route path="inventory" element={<InventoryPage />} />
            <Route path="equipment" element={<EquipmentPage />} />
            <Route path="forecasting" element={<ForecastingPage />} />
            <Route path="parameters" element={<ParametersPage />} />
            <Route path="forecast" element={<ForecastPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="executive" element={<ExecutivePage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
