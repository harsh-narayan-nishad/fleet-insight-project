
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ForecastScenario, ForecastResults as ForecastResultsType, YearlyForecast } from '@/types/financial';
import { FinancialDataService } from '@/services/financialDataService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, DollarSign, Zap, Calendar } from 'lucide-react';

interface ForecastResultsProps {
  activeScenarioId: string | null;
}

const ForecastResults = ({ activeScenarioId }: ForecastResultsProps) => {
  const [scenario, setScenario] = useState<ForecastScenario | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (activeScenarioId) {
      loadScenario();
    }
  }, [activeScenarioId]);

  const loadScenario = () => {
    try {
      const scenarios = FinancialDataService.getForecastScenarios();
      const foundScenario = scenarios.find(s => s.id === activeScenarioId);
      setScenario(foundScenario || null);
    } catch (error) {
      toast({
        title: "Error Loading Scenario",
        description: "Failed to load scenario data.",
        variant: "destructive",
      });
    }
  };

  const calculateForecast = async () => {
    if (!scenario) return;

    setIsCalculating(true);
    try {
      // Simulate forecast calculation
      await new Promise(resolve => setTimeout(resolve, 2000));

      const yearlyData: YearlyForecast[] = [];
      let totalCost = 0;

      for (let year = scenario.parameters.startYear; year <= scenario.parameters.endYear; year++) {
        const yearIndex = year - scenario.parameters.startYear;
        const inflationMultiplier = Math.pow(1 + scenario.parameters.inflationRate / 100, yearIndex);
        const baseSpending = 2000000; // Base annual spending
        
        const yearlySpending = baseSpending * inflationMultiplier * (1 + scenario.parameters.tariffRate / 100);
        const vehicleCount = 120 + yearIndex * 5; // Growing fleet
        const evCount = Math.floor(vehicleCount * (scenario.parameters.evTransitionRates.smallVehicles / 100));
        
        totalCost += yearlySpending;
        
        yearlyData.push({
          year,
          totalSpending: yearlySpending,
          vehicleCount,
          evCount,
          averageCost: yearlySpending / vehicleCount,
          categoryBreakdown: {
            'Small Vehicles': { count: Math.floor(vehicleCount * 0.6), spending: yearlySpending * 0.4 },
            'Large Vehicles': { count: Math.floor(vehicleCount * 0.3), spending: yearlySpending * 0.5 },
            'Electric Vehicles': { count: evCount, spending: yearlySpending * 0.1 },
          },
        });
      }

      const results: ForecastResultsType = {
        totalCost,
        yearlyBreakdown: yearlyData,
        evTransitionImpact: totalCost * 0.15,
        costDriverAnalysis: {
          inflation: totalCost * (scenario.parameters.inflationRate / 100),
          tariffs: totalCost * (scenario.parameters.tariffRate / 100),
          evPremium: totalCost * 0.12,
        },
      };

      const updatedScenario = { ...scenario, results };
      setScenario(updatedScenario);

      // Save results
      const scenarios = FinancialDataService.getForecastScenarios();
      const updatedScenarios = scenarios.map(s => s.id === scenario.id ? updatedScenario : s);
      FinancialDataService.saveForecastScenarios(updatedScenarios);

      toast({
        title: "Forecast Complete",
        description: "Forecast calculation completed successfully.",
      });
    } catch (error) {
      toast({
        title: "Calculation Error",
        description: "Failed to calculate forecast results.",
        variant: "destructive",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (!scenario) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <p className="text-muted-foreground">Select a scenario to view forecast results</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Forecast Results - {scenario.name}</span>
            <Button 
              onClick={calculateForecast} 
              disabled={isCalculating}
              className="flex items-center gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              {isCalculating ? 'Calculating...' : 'Run Forecast'}
            </Button>
          </CardTitle>
          <CardDescription>
            {scenario.parameters.startYear} - {scenario.parameters.endYear} | 
            Inflation: {scenario.parameters.inflationRate}% | 
            Tariff: {scenario.parameters.tariffRate}%
          </CardDescription>
        </CardHeader>
      </Card>

      {scenario.results && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium">Total Cost</span>
                </div>
                <div className="text-2xl font-bold mt-2">
                  {formatCurrency(scenario.results.totalCost)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium">EV Impact</span>
                </div>
                <div className="text-2xl font-bold mt-2">
                  {formatCurrency(scenario.results.evTransitionImpact)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                  <span className="text-sm font-medium">Inflation Impact</span>
                </div>
                <div className="text-2xl font-bold mt-2">
                  {formatCurrency(scenario.results.costDriverAnalysis.inflation)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium">Forecast Years</span>
                </div>
                <div className="text-2xl font-bold mt-2">
                  {scenario.results.yearlyBreakdown.length}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Annual Spending Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={scenario.results.yearlyBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Line 
                      type="monotone" 
                      dataKey="totalSpending" 
                      stroke="#2563eb" 
                      strokeWidth={2}
                      name="Total Spending"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vehicle Count vs EV Adoption</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={scenario.results.yearlyBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="vehicleCount" fill="#94a3b8" name="Total Vehicles" />
                    <Bar dataKey="evCount" fill="#22c55e" name="Electric Vehicles" />
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

export default ForecastResults;
