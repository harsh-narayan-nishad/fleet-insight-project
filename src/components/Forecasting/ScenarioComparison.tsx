
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { ForecastScenario } from '@/types/financial';
import { FinancialDataService } from '@/services/financialDataService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { GitCompare } from 'lucide-react';

const ScenarioComparison = () => {
  const [scenarios, setScenarios] = useState<ForecastScenario[]>([]);
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadScenarios();
  }, []);

  const loadScenarios = () => {
    try {
      const data = FinancialDataService.getForecastScenarios();
      const scenariosWithResults = data.filter(s => s.results);
      setScenarios(scenariosWithResults);
    } catch (error) {
      toast({
        title: "Error Loading Scenarios",
        description: "Failed to load scenario data.",
        variant: "destructive",
      });
    }
  };

  const handleScenarioToggle = (scenarioId: string, checked: boolean) => {
    if (checked) {
      if (selectedScenarios.length < 4) {
        setSelectedScenarios(prev => [...prev, scenarioId]);
      } else {
        toast({
          title: "Limit Reached",
          description: "You can compare up to 4 scenarios at once.",
          variant: "destructive",
        });
      }
    } else {
      setSelectedScenarios(prev => prev.filter(id => id !== scenarioId));
    }
  };

  const getComparisonData = () => {
    const selectedScenarioData = scenarios.filter(s => selectedScenarios.includes(s.id));
    
    if (selectedScenarioData.length === 0) return [];

    const years = Array.from(new Set(
      selectedScenarioData.flatMap(s => s.results?.yearlyBreakdown.map(y => y.year) || [])
    )).sort();

    return years.map(year => {
      const dataPoint: any = { year };
      
      selectedScenarioData.forEach(scenario => {
        const yearData = scenario.results?.yearlyBreakdown.find(y => y.year === year);
        if (yearData) {
          dataPoint[scenario.name] = yearData.totalSpending;
          dataPoint[`${scenario.name}_evCount`] = yearData.evCount;
        }
      });
      
      return dataPoint;
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getScenarioColor = (index: number) => {
    const colors = ['#2563eb', '#dc2626', '#16a34a', '#ca8a04'];
    return colors[index % colors.length];
  };

  const comparisonData = getComparisonData();
  const selectedScenarioData = scenarios.filter(s => selectedScenarios.includes(s.id));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitCompare className="h-5 w-5" />
            Scenario Comparison
          </CardTitle>
          <CardDescription>
            Select up to 4 scenarios to compare their forecasted outcomes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {scenarios.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No scenarios with results available for comparison.
              Run forecasts on scenarios to enable comparison.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scenarios.map((scenario) => (
                <div key={scenario.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                  <Checkbox
                    id={scenario.id}
                    checked={selectedScenarios.includes(scenario.id)}
                    onCheckedChange={(checked) => handleScenarioToggle(scenario.id, checked as boolean)}
                  />
                  <div className="flex-1">
                    <label htmlFor={scenario.id} className="text-sm font-medium cursor-pointer">
                      {scenario.name}
                    </label>
                    <div className="text-xs text-muted-foreground">
                      Total Cost: {formatCurrency(scenario.results?.totalCost || 0)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedScenarioData.length > 0 && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Cost Comparison Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {selectedScenarioData.map((scenario, index) => (
                  <div key={scenario.id} className="p-4 border rounded-lg">
                    <div 
                      className="w-4 h-4 rounded-full mb-2"
                      style={{ backgroundColor: getScenarioColor(index) }}
                    />
                    <h3 className="font-medium">{scenario.name}</h3>
                    <div className="text-2xl font-bold">
                      {formatCurrency(scenario.results?.totalCost || 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      EV Impact: {formatCurrency(scenario.results?.evTransitionImpact || 0)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Annual Spending Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={comparisonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    {selectedScenarioData.map((scenario, index) => (
                      <Line
                        key={scenario.id}
                        type="monotone"
                        dataKey={scenario.name}
                        stroke={getScenarioColor(index)}
                        strokeWidth={2}
                        name={scenario.name}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>EV Adoption Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    {selectedScenarioData.map((scenario, index) => (
                      <Bar
                        key={scenario.id}
                        dataKey={`${scenario.name}_evCount`}
                        fill={getScenarioColor(index)}
                        name={`${scenario.name} EVs`}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default ScenarioComparison;
