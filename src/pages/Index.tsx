
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import VehicleInventory from "@/components/VehicleInventory";
import ForecastChart from "@/components/ForecastChart";
import PurchaseMixChart from "@/components/PurchaseMixChart";
import DataUpload from "@/components/DataUpload";
import FleetMetrics from "@/components/FleetMetrics";
import DataValidation from "@/components/DataValidation";
import DateDrillDown from "@/components/DateDrillDown";
import InteractiveCharts from "@/components/InteractiveCharts";
import CostParametersPage from "@/components/CostParameters";
import ExecutiveDashboard from "@/components/ExecutiveDashboard";
import AdvancedAnalytics from "@/components/AdvancedAnalytics";
import EnterpriseReporting from "@/components/EnterpriseReporting";
import FleetAnalyticsDashboard from "@/components/FleetAnalyticsDashboard";
import { CleaningReport } from "@/utils/dataCleaningUtils";
import { CostParameters } from "@/types/vehicle";
import { AuthService } from "@/services/authService";

const Index = () => {
  const [lastUpdated, setLastUpdated] = useState<string>("2024-06-07");
  const [activeTab, setActiveTab] = useState("fleet-analytics");
  const [forecastKey, setForecastKey] = useState(0);
  
  // Enhanced sample data with corrected types
  const [fleetData, setFleetData] = useState([
    {
      id: "1",
      licensePlate: "87JD-1",
      startUp: "1992",
      acquisitionValue: 210000.00,
      lcReplaceYear: "2027",
      category: "Small",
      status: "In Service"
    },
    {
      id: "2",
      licensePlate: "13GT-5",
      startUp: "1992",
      acquisitionValue: 210000.00,
      lcReplaceYear: "2029",
      category: "Small",
      status: "In Service"
    },
    {
      id: "3",
      licensePlate: "TAC48X",
      startUp: "2004",
      acquisitionValue: 4200.00,
      lcReplaceYear: "2029",
      category: "Small",
      status: "Running"
    },
    {
      id: "4",
      licensePlate: "NO PLATE",
      startUp: "1970",
      acquisitionValue: 150000.00,
      lcReplaceYear: "2027",
      category: "Big",
      status: "DIE"
    },
    {
      id: "5",
      licensePlate: "XR989A",
      startUp: "2009",
      acquisitionValue: 258215.34,
      lcReplaceYear: "2029",
      category: "EV",
      status: "In Service"
    },
    {
      id: "6",
      licensePlate: "EV-101",
      startUp: "2020",
      acquisitionValue: 45000.00,
      lcReplaceYear: "2030",
      category: "EV",
      status: "In Service"
    },
    {
      id: "7",
      licensePlate: "BIG-TRUCK",
      startUp: "2015",
      acquisitionValue: 85000.00,
      lcReplaceYear: "2030",
      category: "Big",
      status: "In Service"
    },
    {
      id: "8",
      licensePlate: "",
      startUp: "2018",
      acquisitionValue: -1000,
      lcReplaceYear: "2030",
      category: "Small",
      status: "Running"
    }
  ]);

  const [dataQualityReport, setDataQualityReport] = useState<CleaningReport | null>(null);
  const userRole = AuthService.getCurrentUserRole();

  const handleDataCleaned = (cleanedData: any[], report: CleaningReport) => {
    setFleetData(cleanedData);
    setDataQualityReport(report);
    setLastUpdated(new Date().toISOString().split('T')[0]);
  };

  const handleParametersChanged = (parameters: CostParameters) => {
    setForecastKey(prev => prev + 1);
    setLastUpdated(new Date().toISOString().split('T')[0]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">FI</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Fleet Insight</h1>
                <p className="text-sm text-slate-500">Enterprise Fleet Management & Analytics</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-green-700 border-green-300">
                Last Updated: {lastUpdated}
              </Badge>
              {dataQualityReport && (
                <Badge className={
                  dataQualityReport.cleanRecords / dataQualityReport.totalRecords >= 0.9 
                    ? "bg-green-100 text-green-800" 
                    : "bg-yellow-100 text-yellow-800"
                }>
                  Data Quality: {Math.round((dataQualityReport.cleanRecords / dataQualityReport.totalRecords) * 100)}%
                </Badge>
              )}
              <Badge variant="outline">
                Role: {userRole.role}
              </Badge>
              <DataUpload onUploadComplete={() => setLastUpdated(new Date().toISOString().split('T')[0])} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-9 lg:w-[900px]">
            <TabsTrigger value="fleet-analytics">Analytics</TabsTrigger>
            <TabsTrigger value="executive">Executive</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="quality">Data Quality</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="forecast">Forecast</TabsTrigger>
            <TabsTrigger value="parameters">Settings</TabsTrigger>
          </TabsList>

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
            <DataValidation data={fleetData} onDataCleaned={handleDataCleaned} />
          </TabsContent>

          <TabsContent value="timeline">
            <DateDrillDown vehicles={fleetData} />
          </TabsContent>

          <TabsContent value="inventory">
            <VehicleInventory />
          </TabsContent>

          <TabsContent value="forecast">
            <div className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-slate-900">Fleet Forecast Analysis</CardTitle>
                  <CardDescription>
                    Detailed 10-year projections with scenario planning
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Annual Spending Projection</h3>
                      <ForecastChart key={`forecast-detail-${forecastKey}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Vehicle Mix Evolution</h3>
                      <PurchaseMixChart key={`mix-detail-${forecastKey}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <InteractiveCharts vehicles={fleetData} />
            </div>
          </TabsContent>

          <TabsContent value="parameters">
            <CostParametersPage onParametersChanged={handleParametersChanged} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
