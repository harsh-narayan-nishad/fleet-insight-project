
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Eye, FileSpreadsheet, Calculator, Calendar } from 'lucide-react';

interface ReportData {
  vehicleClass: string;
  count2025: number;
  cost2025: number;
  count2026: number;
  cost2026: number;
  count2027: number;
  cost2027: number;
  count2028: number;
  cost2028: number;
  count2029: number;
  cost2029: number;
  count2030: number;
  cost2030: number;
}

interface RadioSpendData {
  department: string;
  spend2026: number;
  spend2027: number;
  spend2028: number;
  spend2029: number;
  spend2030: number;
}

const InteractiveReportTemplates = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(2025);

  // Sample data based on your Excel screenshots
  const vehicleReplacementData: ReportData[] = [
    { vehicleClass: 'LIGHT OPERATIOV', count2025: 139, cost2025: 59095872, count2026: 8, cost2026: 4005469, count2027: 171, cost2027: 67446153, count2028: 165, cost2028: 69838401, count2029: 317, cost2029: 183973463, count2030: 171, cost2030: 109273638 },
    { vehicleClass: 'AERIAL_TRK', count2025: 64, cost2025: 33360339, count2026: 8, cost2026: 4005469, count2027: 107, cost2027: 60913004, count2028: 56, cost2028: 41150580, count2029: 270, cost2029: 156381353, count2030: 32, cost2030: 17515877 },
    { vehicleClass: 'CABLE_PULLER', count2025: 30, cost2025: 18764147, count2026: 6, cost2026: 4005469, count2027: 79, cost2027: 42728146, count2028: 35, cost2028: 24160027, count2029: 257, cost2029: 151370363, count2030: 1, cost2030: 3711739 },
    { vehicleClass: 'DIGGER_TRK', count2025: 0, cost2025: 0, count2026: 0, cost2026: 0, count2027: 3, cost2027: 2509662, count2028: 5, cost2028: 2027016, count2029: 5, cost2029: 1885188, count2030: 2, cost2030: 1217447 }
  ];

  const radioSpendData: RadioSpendData[] = [
    { department: 'ELEC OPERATIONS', spend2026: 40000, spend2027: 855000, spend2028: 750000, spend2029: 1500000, spend2030: 825000 },
    { department: 'GAS OPERATIONS', spend2026: 1485000, spend2027: 2370000, spend2028: 2405000, spend2029: 200000, spend2030: 730000 },
    { department: 'UGS', spend2026: 5000, spend2027: 100000, spend2028: 100000, spend2029: 75000, spend2030: 445000 },
    { department: 'GAS EMERGEN OPS', spend2026: 100000, spend2027: 0, spend2028: 50000, spend2029: 0, spend2030: 85000 }
  ];

  const reportTemplates = [
    {
      id: 'vehicle-replacement',
      title: '10 Year Capital Plan Vehicle Replacement',
      description: 'Complete vehicle replacement forecast by class and year',
      icon: Calculator,
      category: 'Fleet Planning',
      data: vehicleReplacementData
    },
    {
      id: 'radio-spend',
      title: '10 Year Radio Spend Analysis',
      description: 'Radio equipment spending by department and year',
      icon: FileSpreadsheet,
      category: 'Equipment',
      data: radioSpendData
    },
    {
      id: 'ev-summary',
      title: 'EV Fleet Summary Report',
      description: 'Electric vehicle adoption and cost analysis',
      icon: Calendar,
      category: 'Sustainability',
      data: []
    }
  ];

  const downloadExcelReport = (templateId: string) => {
    console.log(`Downloading Excel report for ${templateId}`);
    // Implementation would generate and download Excel file
  };

  const viewDetailedReport = (template: any) => {
    setSelectedTemplate(template.id);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const renderVehicleReplacementDetails = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Vehicle Replacement Details</h3>
        <div className="flex gap-2">
          {[2025, 2026, 2027, 2028, 2029, 2030].map(year => (
            <Button
              key={year}
              variant={selectedYear === year ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedYear(year)}
            >
              {year}
            </Button>
          ))}
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle Class</TableHead>
                <TableHead>Count</TableHead>
                <TableHead>Total Cost</TableHead>
                <TableHead>Avg Cost per Unit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicleReplacementData.map((row, index) => {
                const yearKey = `count${selectedYear}` as keyof ReportData;
                const costKey = `cost${selectedYear}` as keyof ReportData;
                const count = row[yearKey] as number;
                const cost = row[costKey] as number;
                const avgCost = count > 0 ? cost / count : 0;
                
                return (
                  <TableRow key={index} className="hover:bg-muted/50 cursor-pointer">
                    <TableCell className="font-medium">{row.vehicleClass}</TableCell>
                    <TableCell>{count}</TableCell>
                    <TableCell>{formatCurrency(cost)}</TableCell>
                    <TableCell>{formatCurrency(avgCost)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const renderRadioSpendDetails = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Radio Equipment Spending by Department</h3>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead>
                <TableHead>2026</TableHead>
                <TableHead>2027</TableHead>
                <TableHead>2028</TableHead>
                <TableHead>2029</TableHead>
                <TableHead>2030</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {radioSpendData.map((row, index) => {
                const total = row.spend2026 + row.spend2027 + row.spend2028 + row.spend2029 + row.spend2030;
                return (
                  <TableRow key={index} className="hover:bg-muted/50 cursor-pointer">
                    <TableCell className="font-medium">{row.department}</TableCell>
                    <TableCell>{formatCurrency(row.spend2026)}</TableCell>
                    <TableCell>{formatCurrency(row.spend2027)}</TableCell>
                    <TableCell>{formatCurrency(row.spend2028)}</TableCell>
                    <TableCell>{formatCurrency(row.spend2029)}</TableCell>
                    <TableCell>{formatCurrency(row.spend2030)}</TableCell>
                    <TableCell className="font-bold">{formatCurrency(total)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {!selectedTemplate ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportTemplates.map((template) => {
              const Icon = template.icon;
              return (
                <Card key={template.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Icon className="h-8 w-8 text-blue-600" />
                      <Badge variant="outline">{template.category}</Badge>
                    </div>
                    <CardTitle className="text-lg">{template.title}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => viewDetailedReport(template)}
                        className="flex-1"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadExcelReport(template.id)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Excel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Report Details</CardTitle>
                <CardDescription>Interactive data view with drill-down capabilities</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
                  Back to Templates
                </Button>
                <Button onClick={() => downloadExcelReport(selectedTemplate)}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Excel
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {selectedTemplate === 'vehicle-replacement' && renderVehicleReplacementDetails()}
            {selectedTemplate === 'radio-spend' && renderRadioSpendDetails()}
            {selectedTemplate === 'ev-summary' && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">EV Summary report template coming soon...</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InteractiveReportTemplates;
