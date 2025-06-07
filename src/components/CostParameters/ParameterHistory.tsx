
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { CostParameterHistory, CostParameters } from '@/types/vehicle';
import { CostParametersService } from '@/services/costParametersService';
import { AuthService } from '@/services/authService';

interface ParameterHistoryProps {
  onParametersReverted: (parameters: CostParameters) => void;
}

const ParameterHistory = ({ onParametersReverted }: ParameterHistoryProps) => {
  const [history, setHistory] = useState<CostParameterHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [revertingId, setRevertingId] = useState<string | null>(null);
  const { toast } = useToast();
  const userRole = AuthService.getCurrentUserRole();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const historyData = await CostParametersService.getParameterHistory();
      setHistory(historyData);
    } catch (error) {
      toast({
        title: "Error Loading History",
        description: "Failed to load parameter history.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevert = async (historyId: string) => {
    if (userRole.role !== 'Admin') {
      toast({
        title: "Access Denied",
        description: "Only Admin users can revert parameters.",
        variant: "destructive",
      });
      return;
    }

    setRevertingId(historyId);
    try {
      const revertedParameters = await CostParametersService.revertToParameters(historyId);
      onParametersReverted(revertedParameters);
      await loadHistory(); // Refresh history
      
      toast({
        title: "Parameters Reverted",
        description: "Successfully reverted to previous parameter set.",
      });
    } catch (error) {
      toast({
        title: "Revert Failed",
        description: error instanceof Error ? error.message : "Failed to revert parameters.",
        variant: "destructive",
      });
    } finally {
      setRevertingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Parameter History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading history...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Parameter History</CardTitle>
        <CardDescription>
          View and revert to previous parameter configurations
          {userRole.role !== 'Admin' && " (Admin access required for revert)"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No parameter history available.
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <div key={item.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
                    <div>
                      <span className="text-sm font-medium">Inflation Rate</span>
                      <div className="text-lg">{item.inflationRate}%</div>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Tariff Rate</span>
                      <div className="text-lg">{item.tariffRate}%</div>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Small → EV</span>
                      <div className="text-lg">{item.smallToEvRatio}%</div>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Large → EV</span>
                      <div className="text-lg">{item.bigToEvRatio}%</div>
                    </div>
                  </div>
                  {userRole.role === 'Admin' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRevert(item.id)}
                      disabled={revertingId === item.id}
                    >
                      {revertingId === item.id ? "Reverting..." : "Revert"}
                    </Button>
                  )}
                </div>
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>Updated by {item.updatedBy}</span>
                  <div className="flex items-center gap-2">
                    <span>{formatDate(item.updatedAt)}</span>
                    {item.revertedAt && (
                      <Badge variant="secondary">Reverted</Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ParameterHistory;
