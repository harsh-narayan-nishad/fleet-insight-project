
import FleetInteractiveChart from './FleetInteractiveChart';
import FleetCostAnalysisChart from './FleetCostAnalysisChart';
import { useNavigate } from 'react-router-dom';
import { FleetDataService } from '@/services/fleetDataService';

interface FleetOverviewTabProps {
  onChartClick: (data: any, chartTitle: string) => void;
}

const FleetOverviewTab = ({ onChartClick }: FleetOverviewTabProps) => {
  const navigate = useNavigate();
  const top10Expensive = FleetDataService.getTop10MostExpensive();

  // Generate yearly spending data for the interactive chart
  const yearlySpendingData = Array.from({ length: 10 }, (_, index) => {
    const year = 2025 + index;
    const baseSpending = 15000000;
    const variance = Math.random() * 0.3 - 0.15; // +/- 15% variance
    const spending = baseSpending * (1 + variance) * (1.03 ** index); // 3% growth
    
    return {
      year: year.toString(),
      spending: Math.round(spending),
      vehicleCount: 450 + index * 12,
      rawData: top10Expensive // Use existing data for drill-through
    };
  });

  const handleInteractiveChartClick = () => {
    // Navigate to a detailed analytics page
    navigate('/advanced-analytics');
  };

  return (
    <div className="space-y-6">
      {/* Interactive Fleet Spending Trends */}
      <FleetInteractiveChart 
        data={yearlySpendingData}
        onChartClick={handleInteractiveChartClick}
      />

      {/* Cost Analysis Section */}
      <FleetCostAnalysisChart 
        data={top10Expensive}
        onChartClick={onChartClick}
      />
    </div>
  );
};

export default FleetOverviewTab;
