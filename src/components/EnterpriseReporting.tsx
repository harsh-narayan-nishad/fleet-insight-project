
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, Download, Filter, FileText, Mail, Clock } from 'lucide-react';

interface Report {
  id: string;
  name: string;
  description: string;
  type: 'operational' | 'financial' | 'compliance' | 'executive';
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  lastGenerated: string;
  status: 'ready' | 'generating' | 'scheduled';
  recipients: string[];
}

const EnterpriseReporting = () => {
  const [selectedReportType, setSelectedReportType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const reports: Report[] = [
    {
      id: 'R001',
      name: 'Executive Dashboard Summary',
      description: 'High-level KPIs and performance metrics for C-level executives',
      type: 'executive',
      frequency: 'weekly',
      lastGenerated: '2024-06-07',
      status: 'ready',
      recipients: ['ceo@company.com', 'cfo@company.com']
    },
    {
      id: 'R002',
      name: 'Fleet Utilization Analysis',
      description: 'Detailed utilization metrics across all departments and vehicle types',
      type: 'operational',
      frequency: 'monthly',
      lastGenerated: '2024-06-01',
      status: 'ready',
      recipients: ['fleet.manager@company.com', 'operations@company.com']
    },
    {
      id: 'R003',
      name: 'Financial Performance Report',
      description: 'Cost analysis, budget variance, and ROI calculations',
      type: 'financial',
      frequency: 'monthly',
      lastGenerated: '2024-06-05',
      status: 'generating',
      recipients: ['finance@company.com', 'budget.analyst@company.com']
    },
    {
      id: 'R004',
      name: 'Compliance & Safety Audit',
      description: 'Safety compliance, maintenance schedules, and regulatory adherence',
      type: 'compliance',
      frequency: 'quarterly',
      lastGenerated: '2024-04-01',
      status: 'scheduled',
      recipients: ['compliance@company.com', 'safety@company.com']
    },
    {
      id: 'R005',
      name: 'Sustainability Metrics',
      description: 'Carbon footprint, EV adoption, and environmental impact tracking',
      type: 'operational',
      frequency: 'monthly',
      lastGenerated: '2024-06-03',
      status: 'ready',
      recipients: ['sustainability@company.com', 'operations@company.com']
    }
  ];

  const reportTemplates = [
    { id: 'T001', name: 'Cost Center Analysis', category: 'Financial' },
    { id: 'T002', name: 'Vehicle Lifecycle Report', category: 'Operational' },
    { id: 'T003', name: 'Maintenance Schedule Compliance', category: 'Compliance' },
    { id: 'T004', name: 'Driver Performance Analytics', category: 'Operational' },
    { id: 'T005', name: 'Environmental Impact Assessment', category: 'Sustainability' }
  ];

  const filteredReports = reports.filter(report => {
    const matchesType = selectedReportType === 'all' || report.type === selectedReportType;
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const generateReport = (reportId: string) => {
    console.log(`Generating report ${reportId}`);
    // Implementation would trigger report generation
  };

  const scheduleReport = (reportId: string) => {
    console.log(`Scheduling report ${reportId}`);
    // Implementation would open scheduling modal
  };

  const downloadReport = (reportId: string, format: string) => {
    console.log(`Downloading report ${reportId} in ${format} format`);
    // Implementation would trigger download
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return <Badge className="bg-green-100 text-green-800">Ready</Badge>;
      case 'generating':
        return <Badge className="bg-blue-100 text-blue-800">Generating</Badge>;
      case 'scheduled':
        return <Badge className="bg-yellow-100 text-yellow-800">Scheduled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      executive: 'bg-purple-100 text-purple-800',
      financial: 'bg-green-100 text-green-800',
      operational: 'bg-blue-100 text-blue-800',
      compliance: 'bg-red-100 text-red-800'
    };
    return <Badge className={colors[type as keyof typeof colors]}>{type}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Enterprise Reporting
              </CardTitle>
              <CardDescription>Generate, schedule, and manage fleet reports</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                New Report
              </Button>
              <Button>
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Report
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Reports</Label>
              <Input
                id="search"
                placeholder="Search by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-48">
              <Label htmlFor="type-filter">Filter by Type</Label>
              <Select value={selectedReportType} onValueChange={setSelectedReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="executive">Executive</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                  <SelectItem value="operational">Operational</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredReports.map((report) => (
          <Card key={report.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{report.name}</h3>
                    {getTypeBadge(report.type)}
                    {getStatusBadge(report.status)}
                  </div>
                  <p className="text-muted-foreground mb-4">{report.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Frequency: {report.frequency}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Last Generated: {report.lastGenerated}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>{report.recipients.length} recipients</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => generateReport(report.id)}
                    disabled={report.status === 'generating'}
                  >
                    {report.status === 'generating' ? 'Generating...' : 'Generate'}
                  </Button>
                  
                  <Select onValueChange={(format) => downloadReport(report.id, format)}>
                    <SelectTrigger className="w-32">
                      <Download className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Download" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => scheduleReport(report.id)}
                  >
                    Schedule
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Report Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Report Templates</CardTitle>
          <CardDescription>Pre-configured reports for common use cases</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportTemplates.map((template) => (
              <Card key={template.id} className="p-4 cursor-pointer hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">{template.name}</h4>
                    <p className="text-sm text-muted-foreground">{template.category}</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Use Template
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Report Scheduler */}
      <Card>
        <CardHeader>
          <CardTitle>Automated Report Scheduling</CardTitle>
          <CardDescription>Configure automatic report generation and distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Report Frequency</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Recipients</Label>
                <Input placeholder="email@company.com" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Report Types to Include</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {['Executive Summary', 'Financial Analysis', 'Operational Metrics', 'Compliance Check'].map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox id={type} />
                    <Label htmlFor={type} className="text-sm">{type}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button>Save Schedule</Button>
              <Button variant="outline">Preview</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnterpriseReporting;
