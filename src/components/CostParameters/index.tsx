import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { CostParameters } from '@/types/vehicle';
import { CostParametersService } from '@/services/costParametersService';
import { AuthService } from '@/services/authService';
import CostParametersForm from './CostParametersForm';
import ParameterHistory from './ParameterHistory';
import CSVExportImport from './CSVExportImport';

interface CostParametersPageProps {
  onParametersChanged?: (parameters: CostParameters) => void;
}

const CostParametersPage = ({ onParametersChanged }: CostParametersPageProps) => {
  const [currentParameters, setCurrentParameters] = useState<CostParameters | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const userRole = AuthService.getCurrentUserRole();

  useEffect(() => {
    loadCurrentParameters();
  }, []);

  const loadCurrentParameters = async () => {
    try {
      const parameters = await CostParametersService.getCurrentParameters();
      setCurrentParameters(parameters);
    } catch (error) {
      toast({
        title: "Error Loading Parameters",
        description: "Failed to load current cost parameters.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleParametersUpdated = (parameters: CostParameters) => {
    setCurrentParameters(parameters);
    onParametersChanged?.(parameters);
  };

  const handleRefreshDashboard = () => {
    // Trigger dashboard refresh
    onParametersChanged?.(currentParameters!);
    toast({
      title: "Dashboard Refreshed",
      description: "Forecasts have been updated with current parameters.",
    });
  };

  const handleDataUpdated = () => {
    // Refresh any data that might have been imported
    loadCurrentParameters();
    toast({
      title: "Data Refreshed",
      description: "Data has been refreshed after import.",
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center py-12">
          <div className="text-lg">Loading cost parameters...</div>
        </div>
      </div>
    );
  }

  if (!currentParameters) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center py-12">
          <div className="text-lg text-destructive">Failed to load parameters</div>
          <Button onClick={loadCurrentParameters} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Financial Parameters Management</h1>
          <p className="text-muted-foreground">
            Configure cost drivers for fleet forecasting, manage equipment categories, and export data
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-muted-foreground">
            Role: <span className="font-medium">{userRole.role}</span>
          </div>
          <Button onClick={handleRefreshDashboard} variant="outline">
            Refresh Dashboard
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <CostParametersForm
            currentParameters={currentParameters}
            onParametersUpdated={handleParametersUpdated}
          />
          <CSVExportImport onDataUpdated={handleDataUpdated} />
        </div>
        <div>
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <h3 className="font-medium">Current Impact</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Base Cost Multiplier:</span>
                <span className="font-mono">
                  {(1 + currentParameters.tariffRate / 100).toFixed(3)}x
                </span>
              </div>
              <div className="flex justify-between">
                <span>Annual Inflation:</span>
                <span className="font-mono">{currentParameters.inflationRate}%</span>
              </div>
              <div className="flex justify-between">
                <span>Small EV Target:</span>
                <span className="font-mono">{currentParameters.smallToEvRatio}%</span>
              </div>
              <div className="flex justify-between">
                <span>Large EV Target:</span>
                <span className="font-mono">{currentParameters.bigToEvRatio}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ParameterHistory onParametersReverted={handleParametersUpdated} />
    </div>
  );
};

export default CostParametersPage;
