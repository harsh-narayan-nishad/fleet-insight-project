
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/auth/LoginPage";
import SignupPage from "./components/auth/SignupPage";
import Dashboard from "./pages/Dashboard";
import FleetAnalyticsPage from "./pages/FleetAnalyticsPage";
import ExecutivePage from "./pages/ExecutivePage";
import ForecastPage from "./pages/ForecastPage";
import InventoryPage from "./pages/InventoryPage";
import ReportsPage from "./pages/ReportsPage";
import TimelinePage from "./pages/TimelinePage";
import ParametersPage from "./pages/ParametersPage";
import NotFound from "./pages/NotFound";
import { CleaningReport } from "@/utils/dataCleaningUtils";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<string>("2024-06-07");
  const [dataQualityReport, setDataQualityReport] = useState<CleaningReport | null>(null);

  const handleLogin = async (username: string, password: string, rememberMe: boolean): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (username && password) {
      setIsAuthenticated(true);
      setCurrentUser(username);
      return true;
    }
    return false;
  };

  const handleSignup = async (username: string, email: string, password: string, consent: boolean): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (username && email && password && consent) {
      setIsAuthenticated(true);
      setCurrentUser(username);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser('');
  };

  const handleExport = () => {
    console.log('Exporting data...');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {!isAuthenticated ? (
            <Routes>
              <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
              <Route path="/signup" element={<SignupPage onSignup={handleSignup} />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          ) : (
            <Routes>
              <Route path="/" element={
                <Dashboard 
                  currentUser={currentUser}
                  lastUpdated={lastUpdated}
                  dataQualityScore={dataQualityReport ? Math.round((dataQualityReport.cleanRecords / dataQualityReport.totalRecords) * 100) : 95}
                  onExport={handleExport}
                  onLogout={handleLogout}
                />
              }>
                <Route index element={<Navigate to="/fleet-analytics" replace />} />
                <Route path="fleet-analytics" element={<FleetAnalyticsPage />} />
                <Route path="executive" element={<ExecutivePage />} />
                <Route path="forecast" element={<ForecastPage />} />
                <Route path="inventory" element={<InventoryPage />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route path="timeline" element={<TimelinePage />} />
                <Route path="parameters" element={<ParametersPage />} />
              </Route>
              <Route path="/login" element={<Navigate to="/" replace />} />
              <Route path="/signup" element={<Navigate to="/" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          )}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
