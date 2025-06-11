
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ScenarioBuilder from '@/components/Forecasting/ScenarioBuilder';
import ForecastResults from '@/components/Forecasting/ForecastResults';
import ScenarioComparison from '@/components/Forecasting/ScenarioComparison';

const ForecastingPage = () => {
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);

  const handleScenarioCreated = (scenarioId: string) => {
    setActiveScenarioId(scenarioId);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Fleet Forecasting Engine</h1>
        <p className="text-muted-foreground mt-2">
          Create scenarios, run forecasts, and analyze replacement strategies
        </p>
      </div>

      <Tabs defaultValue="scenarios" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="scenarios">Scenario Builder</TabsTrigger>
          <TabsTrigger value="results">Forecast Results</TabsTrigger>
          <TabsTrigger value="comparison">Scenario Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="scenarios" className="space-y-6">
          <ScenarioBuilder onScenarioCreated={handleScenarioCreated} />
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          <ForecastResults activeScenarioId={activeScenarioId} />
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          <ScenarioComparison />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ForecastingPage;
