
import { Tabs, TabsContent } from "@/components/ui/tabs";
import FleetAnalyticsDashboard from "@/components/FleetAnalyticsDashboard";
import ExecutiveDashboard from "@/components/ExecutiveDashboard";
import AdvancedAnalytics from "@/components/AdvancedAnalytics";
import EnterpriseReporting from "@/components/EnterpriseReporting";
import DataValidation from "@/components/DataValidation";
import DateDrillDown from "@/components/DateDrillDown";
import VehicleInventory from "@/components/VehicleInventory";
import ForecastSection from "./ForecastSection";
import CostParametersPage from "@/components/CostParameters";
import { CleaningReport } from "@/utils/dataCleaningUtils";
import { CostParameters } from "@/types/vehicle";

interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  fleetData: any[];
  onDataCleaned: (cleanedData: any[], report: CleaningReport) => void;
  onParametersChanged: (parameters: CostParameters) => void;
  forecastKey: number;
}

const DashboardTabs = ({
  activeTab,
  onTabChange,
  fleetData,
  onDataCleaned,
  onParametersChanged,
  forecastKey,
}: DashboardTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-6">
      <TabsContent value="fleet-analytics" className="space-y-6">
        <FleetAnalyticsDashboard />
      </TabsContent>

      <TabsContent value="executive" className="space-y-6">
        <ExecutiveDashboard />
      </TabsContent>

      <TabsContent value="advanced" className="space-y-6">
        <AdvancedAnalytics />
      </TabsContent>

      <TabsContent value="reports" className="space-y-6">
        <EnterpriseReporting />
      </TabsContent>

      <TabsContent value="quality">
        <DataValidation data={fleetData} onDataCleaned={onDataCleaned} />
      </TabsContent>

      <TabsContent value="timeline">
        <DateDrillDown vehicles={fleetData} />
      </TabsContent>

      <TabsContent value="inventory">
        <VehicleInventory />
      </TabsContent>

      <TabsContent value="forecast">
        <ForecastSection vehicles={fleetData} forecastKey={forecastKey} />
      </TabsContent>

      <TabsContent value="parameters">
        <CostParametersPage onParametersChanged={onParametersChanged} />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
