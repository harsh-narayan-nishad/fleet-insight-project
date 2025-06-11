
import { useState } from "react";
import { CleaningReport } from "@/utils/dataCleaningUtils";
import { CostParameters } from "@/types/vehicle";
import { AuthService } from "@/services/authService";
import AuthContainer from "@/components/auth/AuthContainer";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardTabs from "@/components/dashboard/DashboardTabs";
import { useFleetData } from "@/hooks/useFleetData";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { isAuthenticated, currentUser, login, logout } = useAuth();
  const { fleetData, setFleetData } = useFleetData();
  const [lastUpdated, setLastUpdated] = useState<string>("2024-06-07");
  const [activeTab, setActiveTab] = useState("fleet-analytics");
  const [forecastKey, setForecastKey] = useState(0);
  const [dataQualityReport, setDataQualityReport] = useState<CleaningReport | null>(null);
  
  const userRole = AuthService.getCurrentUserRole();

  const handleExport = () => {
    // Mock export functionality
    console.log('Exporting data...');
  };

  const handleDataCleaned = (cleanedData: any[], report: CleaningReport) => {
    setFleetData(cleanedData);
    setDataQualityReport(report);
    setLastUpdated(new Date().toISOString().split('T')[0]);
  };

  const handleParametersChanged = (parameters: CostParameters) => {
    setForecastKey(prev => prev + 1);
    setLastUpdated(new Date().toISOString().split('T')[0]);
  };

  if (!isAuthenticated) {
    return <AuthContainer onAuthSuccess={login} />;
  }

  return (
    <DashboardLayout
      userName={currentUser}
      lastUpdated={lastUpdated}
      dataQualityScore={dataQualityReport ? Math.round((dataQualityReport.cleanRecords / dataQualityReport.totalRecords) * 100) : 95}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onExport={handleExport}
      onLogout={logout}
    >
      <DashboardTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        fleetData={fleetData}
        onDataCleaned={handleDataCleaned}
        onParametersChanged={handleParametersChanged}
        forecastKey={forecastKey}
      />
    </DashboardLayout>
  );
};

export default Index;
