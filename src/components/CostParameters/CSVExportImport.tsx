
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { FinancialDataService } from '@/services/financialDataService';
import { CSVExportData } from '@/types/financial';
import { Download, Upload, FileText } from 'lucide-react';

interface CSVExportImportProps {
  onDataUpdated?: () => void;
}

const CSVExportImport = ({ onDataUpdated }: CSVExportImportProps) => {
  const [exportType, setExportType] = useState<CSVExportData['type']>('cost-parameters');
  const [importing, setImporting] = useState(false);
  const { toast } = useToast();

  const handleExport = () => {
    try {
      const csvData = FinancialDataService.exportToCSV(exportType);
      
      // Create and download the CSV file
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${exportType}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: `${exportType} data has been exported to CSV.`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting the data.",
        variant: "destructive",
      });
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const csvData = e.target?.result as string;
        FinancialDataService.importFromCSV(csvData, exportType);
        
        toast({
          title: "Import Successful",
          description: `${exportType} data has been imported successfully.`,
        });
        
        onDataUpdated?.();
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "There was an error importing the CSV data. Please check the file format.",
          variant: "destructive",
        });
      } finally {
        setImporting(false);
        // Reset the input
        event.target.value = '';
      }
    };

    reader.readAsText(file);
  };

  const getTypeLabel = (type: CSVExportData['type']) => {
    switch (type) {
      case 'cost-parameters':
        return 'Cost Parameters';
      case 'equipment-categories':
        return 'Equipment Categories';
      case 'price-history':
        return 'Price History';
      case 'forecast-results':
        return 'Forecast Scenarios';
      default:
        return type;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          CSV Data Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Data Type</label>
          <Select value={exportType} onValueChange={(value: CSVExportData['type']) => setExportType(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select data type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cost-parameters">Cost Parameters</SelectItem>
              <SelectItem value="equipment-categories">Equipment Categories</SelectItem>
              <SelectItem value="price-history">Price History</SelectItem>
              <SelectItem value="forecast-results">Forecast Scenarios</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-3">
          <Button onClick={handleExport} variant="outline" className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Export {getTypeLabel(exportType)}
          </Button>
          
          <div className="flex-1">
            <input
              type="file"
              accept=".csv"
              onChange={handleImport}
              disabled={importing}
              className="hidden"
              id="csv-import"
            />
            <Button
              onClick={() => document.getElementById('csv-import')?.click()}
              disabled={importing}
              variant="outline"
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              {importing ? 'Importing...' : `Import ${getTypeLabel(exportType)}`}
            </Button>
          </div>
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Export current data to CSV format for external analysis</p>
          <p>• Import CSV data to update the system (use the same format as exported files)</p>
          <p>• Equipment categories and price history support bulk updates via CSV</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CSVExportImport;
