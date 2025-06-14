
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import InventoryPage from './pages/InventoryPage';
import ForecastPage from './pages/ForecastPage';
import ReportsPage from './pages/ReportsPage';
import ExecutivePage from './pages/ExecutivePage';
import TimelinePage from './pages/TimelinePage';
import ForecastingPage from './pages/ForecastingPage';
import ParametersPage from './pages/ParametersPage';
import EquipmentPage from './pages/EquipmentPage';
import FleetAnalyticsPage from './pages/FleetAnalyticsPage';
import AdvancedAnalyticsPage from './pages/AdvancedAnalyticsPage';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  // Mock data and handlers for dashboard props
  const mockCurrentUser = "Fleet Manager";
  const mockLastUpdated = new Date().toISOString().split('T')[0];
  const mockDataQualityScore = 95;
  
  const handleExport = () => {
    console.log('Exporting data...');
  };
  
  const handleLogout = () => {
    console.log('Logging out...');
  };

  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={
            <Dashboard 
              currentUser={mockCurrentUser}
              lastUpdated={mockLastUpdated}
              dataQualityScore={mockDataQualityScore}
              onExport={handleExport}
              onLogout={handleLogout}
            />
          } />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/forecast" element={<ForecastPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/executive" element={<ExecutivePage />} />
          <Route path="/timeline" element={<TimelinePage />} />
          <Route path="/forecasting" element={<ForecastingPage />} />
          <Route path="/parameters" element={<ParametersPage />} />
          <Route path="/equipment" element={<EquipmentPage />} />
          <Route path="/fleet-analytics" element={<FleetAnalyticsPage />} />
          <Route path="/advanced-analytics" element={<AdvancedAnalyticsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
