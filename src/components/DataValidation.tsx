
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { validateVehicleData, ValidationIssue, CleaningReport } from "@/utils/dataCleaningUtils";

interface DataValidationProps {
  data: any[];
  onDataCleaned: (cleanedData: any[], report: CleaningReport) => void;
}

const DataValidation = ({ data, onDataCleaned }: DataValidationProps) => {
  const [validationResult, setValidationResult] = useState<{
    cleanedData: any[];
    issues: ValidationIssue[];
    report: CleaningReport;
  } | null>(null);
  const [autoFixApplied, setAutoFixApplied] = useState(false);

  useEffect(() => {
    if (data && data.length > 0) {
      const result = validateVehicleData(data);
      setValidationResult(result);
    }
  }, [data]);

  const handleAutoFix = () => {
    if (validationResult) {
      const fixedData = validationResult.cleanedData.map(vehicle => {
        const vehicleIssues = validationResult.issues.filter(issue => 
          issue.id.startsWith(vehicle.id || vehicle.licensePlate)
        );
        
        let fixed = { ...vehicle };
        vehicleIssues.forEach(issue => {
          if (issue.suggestedValue !== undefined) {
            fixed[issue.field] = issue.suggestedValue;
          }
        });
        
        return fixed;
      });

      const newResult = validateVehicleData(fixedData);
      setValidationResult(newResult);
      setAutoFixApplied(true);
      onDataCleaned(newResult.cleanedData, newResult.report);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  if (!validationResult) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">No data to validate</div>
        </CardContent>
      </Card>
    );
  }

  const { report, issues } = validationResult;
  const dataQualityScore = Math.round((report.cleanRecords / report.totalRecords) * 100);

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Data Quality Report
          <Badge className={dataQualityScore >= 90 ? "bg-green-100 text-green-800" : dataQualityScore >= 70 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}>
            {dataQualityScore}% Clean
          </Badge>
        </CardTitle>
        <CardDescription>
          Automated data validation and cleaning recommendations
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="summary" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="issues">Issues ({issues.length})</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>

          <TabsContent value="summary">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Data Quality Score</span>
                <div className="flex items-center gap-2">
                  <Progress value={dataQualityScore} className="w-24" />
                  <span className="text-sm font-medium">{dataQualityScore}%</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold text-slate-900">{report.totalRecords}</div>
                  <div className="text-sm text-slate-600">Total Records</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-700">{report.cleanRecords}</div>
                  <div className="text-sm text-slate-600">Clean Records</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-700">{report.issuesFound}</div>
                  <div className="text-sm text-slate-600">Issues Found</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-700">{report.missingLicensePlates}</div>
                  <div className="text-sm text-slate-600">Missing Plates</div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="issues">
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {issues.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                  <p>No issues found! Your data is clean.</p>
                </div>
              ) : (
                issues.map((issue, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border border-slate-200 rounded-lg">
                    {getSeverityIcon(issue.severity)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{issue.field}</span>
                        <Badge className={getSeverityColor(issue.severity)} variant="outline">
                          {issue.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 mb-1">{issue.issue}</p>
                      <div className="text-xs text-slate-500">
                        Original: <code className="bg-slate-100 px-1 rounded">{String(issue.originalValue)}</code>
                        {issue.suggestedValue && (
                          <>
                            {" → Suggested: "}
                            <code className="bg-green-100 px-1 rounded">{String(issue.suggestedValue)}</code>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="actions">
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Automatic Data Cleaning</h3>
                <p className="text-sm text-blue-700 mb-3">
                  Apply suggested fixes to improve data quality automatically.
                </p>
                <Button 
                  onClick={handleAutoFix}
                  disabled={autoFixApplied || issues.filter(i => i.suggestedValue).length === 0}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {autoFixApplied ? "Auto-fixes Applied" : "Apply Auto-fixes"}
                </Button>
              </div>
              
              {autoFixApplied && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Data cleaning completed successfully!</span>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DataValidation;
