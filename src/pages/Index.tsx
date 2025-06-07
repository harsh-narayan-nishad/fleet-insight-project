
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

const Index = () => {
  const [lastUpdated, setLastUpdated] = useState<string>("2024-06-07");
  const [activeTab, setActiveTab] = useState("dashboard");

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
                <p className="text-sm text-slate-500">Vehicle Fleet Planning & Forecasting</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-green-700 border-green-300">
                Last Updated: {lastUpdated}
              </Badge>
              <DataUpload onUploadComplete={() => setLastUpdated(new Date().toISOString().split('T')[0])} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-96">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
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
                      <Badge variant="outline">847</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Clean Records</span>
                      <Badge className="bg-green-100 text-green-800">834</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Records with Issues</span>
                      <Badge variant="destructive">13</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Missing License Plates</span>
                      <Badge variant="secondary">5</Badge>
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
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
