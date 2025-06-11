
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ForecastScenario } from '@/types/financial';
import { FinancialDataService } from '@/services/financialDataService';
import { Play, Settings, Save } from 'lucide-react';

interface ScenarioBuilderProps {
  onScenarioCreated: (scenarioId: string) => void;
}

const ScenarioBuilder = ({ onScenarioCreated }: ScenarioBuilderProps) => {
  const [scenarios, setScenarios] = useState<ForecastScenario[]>([]);
  const [newScenario, setNewScenario] = useState({
    name: '',
    description: '',
    parameters: {
      startYear: new Date().getFullYear(),
      endYear: new Date().getFullYear() + 10,
      inflationRate: 3.2,
      tariffRate: 2.5,
      evTransitionRates: {
        smallVehicles: 25,
        largeVehicles: 15,
      },
    },
  });
  const { toast } = useToast();

  useEffect(() => {
    loadScenarios();
  }, []);

  const loadScenarios = () => {
    try {
      const data = FinancialDataService.getForecastScenarios();
      setScenarios(data);
    } catch (error) {
      toast({
        title: "Error Loading Scenarios",
        description: "Failed to load forecast scenarios.",
        variant: "destructive",
      });
    }
  };

  const handleCreateScenario = () => {
    if (!newScenario.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Scenario name is required.",
        variant: "destructive",
      });
      return;
    }

    try {
      const scenario: ForecastScenario = {
        id: Date.now().toString(),
        name: newScenario.name,
        description: newScenario.description,
        parameters: newScenario.parameters,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updatedScenarios = [...scenarios, scenario];
      FinancialDataService.saveForecastScenarios(updatedScenarios);
      setScenarios(updatedScenarios);
      
      onScenarioCreated(scenario.id);
      
      toast({
        title: "Scenario Created",
        description: "Forecast scenario created successfully.",
      });

      // Reset form
      setNewScenario({
        name: '',
        description: '',
        parameters: {
          startYear: new Date().getFullYear(),
          endYear: new Date().getFullYear() + 10,
          inflationRate: 3.2,
          tariffRate: 2.5,
          evTransitionRates: {
            smallVehicles: 25,
            largeVehicles: 15,
          },
        },
      });
    } catch (error) {
      toast({
        title: "Error Creating Scenario",
        description: error instanceof Error ? error.message : "Failed to create scenario.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Create New Scenario
          </CardTitle>
          <CardDescription>
            Define parameters for a new forecasting scenario
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="scenario-name">Scenario Name</Label>
              <Input
                id="scenario-name"
                value={newScenario.name}
                onChange={(e) => setNewScenario({ ...newScenario, name: e.target.value })}
                placeholder="e.g., Conservative Growth"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="scenario-description">Description</Label>
              <Textarea
                id="scenario-description"
                value={newScenario.description}
                onChange={(e) => setNewScenario({ ...newScenario, description: e.target.value })}
                placeholder="Brief description of this scenario..."
                rows={3}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-year">Start Year</Label>
              <Input
                id="start-year"
                type="number"
                min="2020"
                max="2030"
                value={newScenario.parameters.startYear}
                onChange={(e) => setNewScenario({
                  ...newScenario,
                  parameters: {
                    ...newScenario.parameters,
                    startYear: parseInt(e.target.value) || new Date().getFullYear()
                  }
                })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end-year">End Year</Label>
              <Input
                id="end-year"
                type="number"
                min="2025"
                max="2050"
                value={newScenario.parameters.endYear}
                onChange={(e) => setNewScenario({
                  ...newScenario,
                  parameters: {
                    ...newScenario.parameters,
                    endYear: parseInt(e.target.value) || new Date().getFullYear() + 10
                  }
                })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="inflation-rate">Inflation Rate (%)</Label>
              <Input
                id="inflation-rate"
                type="number"
                step="0.1"
                min="0"
                max="20"
                value={newScenario.parameters.inflationRate}
                onChange={(e) => setNewScenario({
                  ...newScenario,
                  parameters: {
                    ...newScenario.parameters,
                    inflationRate: parseFloat(e.target.value) || 0
                  }
                })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tariff-rate">Tariff Rate (%)</Label>
              <Input
                id="tariff-rate"
                type="number"
                step="0.1"
                min="0"
                max="50"
                value={newScenario.parameters.tariffRate}
                onChange={(e) => setNewScenario({
                  ...newScenario,
                  parameters: {
                    ...newScenario.parameters,
                    tariffRate: parseFloat(e.target.value) || 0
                  }
                })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="small-ev-rate">Small Vehicle → EV Rate (%)</Label>
              <Input
                id="small-ev-rate"
                type="number"
                min="0"
                max="100"
                value={newScenario.parameters.evTransitionRates.smallVehicles}
                onChange={(e) => setNewScenario({
                  ...newScenario,
                  parameters: {
                    ...newScenario.parameters,
                    evTransitionRates: {
                      ...newScenario.parameters.evTransitionRates,
                      smallVehicles: parseInt(e.target.value) || 0
                    }
                  }
                })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="large-ev-rate">Large Vehicle → EV Rate (%)</Label>
              <Input
                id="large-ev-rate"
                type="number"
                min="0"
                max="100"
                value={newScenario.parameters.evTransitionRates.largeVehicles}
                onChange={(e) => setNewScenario({
                  ...newScenario,
                  parameters: {
                    ...newScenario.parameters,
                    evTransitionRates: {
                      ...newScenario.parameters.evTransitionRates,
                      largeVehicles: parseInt(e.target.value) || 0
                    }
                  }
                })}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleCreateScenario} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Create Scenario
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Scenarios</CardTitle>
          <CardDescription>
            Previously created forecast scenarios
          </CardDescription>
        </CardHeader>
        <CardContent>
          {scenarios.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No scenarios created yet. Create your first scenario above.
            </div>
          ) : (
            <div className="space-y-4">
              {scenarios.map((scenario) => (
                <div key={scenario.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{scenario.name}</h3>
                      <p className="text-sm text-muted-foreground">{scenario.description}</p>
                      <div className="text-xs text-muted-foreground mt-2">
                        {scenario.parameters.startYear} - {scenario.parameters.endYear} | 
                        Inflation: {scenario.parameters.inflationRate}% | 
                        Tariff: {scenario.parameters.tariffRate}%
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onScenarioCreated(scenario.id)}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ScenarioBuilder;
