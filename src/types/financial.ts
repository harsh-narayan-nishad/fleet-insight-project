
export interface EquipmentCategory {
  id: string;
  name: string;
  type: 'vehicle' | 'equipment';
  defaultLifespan: number; // years
  createdAt: string;
  updatedAt: string;
}

export interface VehiclePriceHistory {
  id: string;
  category: string;
  year: number;
  basePrice: number;
  evPrice?: number;
  source: string;
  createdAt: string;
  updatedAt: string;
}

export interface ForecastScenario {
  id: string;
  name: string;
  description?: string;
  parameters: {
    startYear: number;
    endYear: number;
    inflationRate: number;
    tariffRate: number;
    evTransitionRates: {
      smallVehicles: number;
      largeVehicles: number;
    };
  };
  results?: ForecastResults;
  createdAt: string;
  updatedAt: string;
}

export interface ForecastResults {
  totalCost: number;
  yearlyBreakdown: YearlyForecast[];
  evTransitionImpact: number;
  costDriverAnalysis: {
    inflation: number;
    tariffs: number;
    evPremium: number;
  };
}

export interface YearlyForecast {
  year: number;
  totalSpending: number;
  vehicleCount: number;
  evCount: number;
  averageCost: number;
  categoryBreakdown: Record<string, {
    count: number;
    spending: number;
  }>;
}

export interface CSVExportData {
  type: 'cost-parameters' | 'equipment-categories' | 'price-history' | 'forecast-results';
  data: any[];
  timestamp: string;
  filename: string;
}
