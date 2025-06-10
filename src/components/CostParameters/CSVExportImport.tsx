
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { FinancialDataService } from '@/services/financialDataService';
import { Download, Upload } from 'lucide-react';

interface CSVExportImportProps {
  onDataUpdated?: () => void;
}

const CSVExportImport = ({ onDataUpdated }: CSVExportImportProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();

  const handleExport = async (type: 'cost-parameters' | 'equipment-categories' | 'price-history') => {
    setIsExporting(true);
    try {
      const csvContent = FinancialDataService.exportToCSV(type);
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${type}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: `${type.replace('-', ' ')} data exported successfully.`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: error instanceof Error ? error.message : "Failed to export data.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>, type: 'equipment-categories' | 'price-history') => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const text = await file.text();
      FinancialDataService.importFromCSV(text, type);
      onDataUpdated?.();

      toast({
        title: "Import Successful",
        description: `${type.replace('-', ' ')} data imported successfully.`,
      });
    } catch (error) {
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "Failed to import data.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
      // Reset the input
      event.target.value = '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Data Export & Import
        </CardTitle>
        <CardDescription>
          Export financial data to CSV for Power BI integration or import updated data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-medium mb-3">Export Data</h4>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('cost-parameters')}
              disabled={isExporting}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Cost Parameters
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('equipment-categories')}
              disabled={isExporting}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Equipment Categories
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('price-history')}
              disabled={isExporting}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Price History
            </Button>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3">Import Data</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="equipment-import">Equipment Categories</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="equipment-import"
                  type="file"
                  accept=".csv"
                  onChange={(e) => handleImport(e, 'equipment-categories')}
                  disabled={isImporting}
                  className="file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:font-medium"
                />
                <Upload className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price-import">Price History</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="price-import"
                  type="file"
                  accept=".csv"
                  onChange={(e) => handleImport(e, 'price-history')}
                  disabled={isImporting}
                  className="file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:font-medium"
                />
                <Upload className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-4">
          <h5 className="font-medium text-sm mb-2">Power BI Integration</h5>
          <p className="text-sm text-muted-foreground">
            Exported CSV files are formatted for direct import into Power BI. 
            Use the "Get Data > Text/CSV" option in Power BI to import these files.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CSVExportImport;
