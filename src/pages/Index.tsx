
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
import { CleaningReport } from "@/utils/dataCleaningUtils";

const Index = () => {
  const [lastUpdated, setLastUpdated] = useState<string>("2024-06-07");
  const [activeTab, setActiveTab] = useState("dashboard");
  
  // Enhanced sample data with more realistic variations
  const [fleetData, setFleetData] = useState([
    {
      id: 1,
      licensePlate: "87JD-1",
      startUp: "1992",
      acquisitionValue: 210000.00,
      lifeCycle: 21,
      depYears: 14,
      lcReplaceDate: "7/30/2013",
      financeAdjustment: 14,
      lcReplaceYear: "2027",
      category: "Small",
      status: "In Service"
    },
    {
      id: 2,
      licensePlate: "13GT-5",
      startUp: "1992",
      acquisitionValue: 210000.00,
      lifeCycle: 21,
      depYears: 14,
      lcReplaceDate: "7/31/2013",
      financeAdjustment: 16,
      lcReplaceYear: "2029",
      category: "Small",
      status: "In Service"
    },
    {
      id: 3,
      licensePlate: "TAC48X",
      startUp: "2004",
      acquisitionValue: 4200.00,
      lifeCycle: 21,
      depYears: 14,
      lcReplaceDate: "9/10/2025",
      financeAdjustment: 4,
      lcReplaceYear: "2029",
      category: "Small",
      status: "Running"
    },
    {
      id: 4,
      licensePlate: "NO PLATE",
      startUp: "1970",
      acquisitionValue: 150000.00,
      lifeCycle: 25,
      depYears: 14,
      lcReplaceDate: "1/30/1995",
      financeAdjustment: 32,
      lcReplaceYear: "2027",
      category: "Big",
      status: "DIE"
    },
    {
      id: 5,
      licensePlate: "XR989A",
      startUp: "2009",
      acquisitionValue: 258215.34,
      lifeCycle: 11,
      depYears: 14,
      lcReplaceDate: "9/21/2020",
      financeAdjustment: 9,
      lcReplaceYear: "2029",
      category: "EV",
      status: "In Service"
    },
    // Additional sample data for better demonstrations
    {
      id: 6,
      licensePlate: "EV-101",
      startUp: "2020",
      acquisitionValue: 45000.00,
      lifeCycle: 10,
      depYears: 8,
      lcReplaceDate: "1/15/2030",
      financeAdjustment: 2,
      lcReplaceYear: "2030",
      category: "EV",
      status: "In Service"
    },
    {
      id: 7,
      licensePlate: "BIG-TRUCK",
      startUp: "2015",
      acquisitionValue: 85000.00,
      lifeCycle: 15,
      depYears: 10,
      lcReplaceDate: "6/20/2030",
      financeAdjustment: 5,
      lcReplaceYear: "2030",
      category: "Big",
      status: "In Service"
    },
    {
      id: 8,
      licensePlate: "",
      startUp: "2018",
      acquisitionValue: -1000,
      lifeCycle: 12,
      depYears: 6,
      lcReplaceDate: "invalid-date",
      financeAdjustment: 3,
      lcReplaceYear: "2030",
      category: "Small",
      status: "Running"
    }
  ]);

  const [dataQualityReport, setDataQualityReport] = useState<CleaningReport | null>(null);

  const handleDataCleaned = (cleanedData: any[], report: CleaningReport) => {
    setFleetData(cleanedData);
    setDataQualityReport(report);
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
                <span className="text-white font-bold text-sm">FF</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">FleetForecaster</h1>
                <p className="text-sm text-slate-500">Advanced Fleet Planning & Analytics</p>
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
              <DataUpload onUploadComplete={() => setLastUpdated(new Date().toISOString().split('T')[0])} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:w-[600px]">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="quality">Data Quality</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="forecast">Forecast</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <FleetMetrics />
                <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-slate-900">10-Year Spending Forecast</CardTitle>
                    <CardDescription>
                      Projected annual fleet expenditure with inflation and EV transition
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ForecastChart />
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-6">
                <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-slate-900">Purchase Mix</CardTitle>
                    <CardDescription>Current fleet composition</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PurchaseMixChart />
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-slate-900">EV Transition Progress</CardTitle>
                    <CardDescription>Progress toward electrification goals</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Small Vehicle EV Ratio</span>
                        <span>18%</span>
                      </div>
                      <Progress value={18} className="h-2" />
                      <p className="text-xs text-slate-500 mt-1">Target: 25% by 2025</p>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Large Vehicle EV Ratio</span>
                        <span>8%</span>
                      </div>
                      <Progress value={8} className="h-2" />
                      <p className="text-xs text-slate-500 mt-1">Target: 15% by 2025</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
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
                      <ForecastChart />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Vehicle Mix Evolution</h3>
                      <PurchaseMixChart />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="space-y-6">
              <InteractiveCharts vehicles={fleetData} />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-slate-900">Data Quality Report</CardTitle>
                    <CardDescription>Latest import status and data validation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Records Processed</span>
                        <Badge variant="outline">{fleetData.length}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Clean Records</span>
                        <Badge className="bg-green-100 text-green-800">
                          {dataQualityReport?.cleanRecords || fleetData.length - 2}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Records with Issues</span>
                        <Badge variant="destructive">
                          {dataQualityReport?.issuesFound || 2}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Missing License Plates</span>
                        <Badge variant="secondary">
                          {dataQualityReport?.missingLicensePlates || 1}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-slate-900">Compliance Status</CardTitle>
                    <CardDescription>Environmental and policy compliance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">EV Purchase Compliance</span>
                        <Badge className="bg-blue-100 text-blue-800">On Track</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Lifecycle Management</span>
                        <Badge className="bg-green-100 text-green-800">Good</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Cost Efficiency</span>
                        <Badge className="bg-yellow-100 text-yellow-800">Review</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
