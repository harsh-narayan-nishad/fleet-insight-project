
import { CostParameters } from '@/types/vehicle';
import { CostParametersService } from './costParametersService';

export interface ForecastData {
  year: string;
  totalSpending: number;
  evSpending: number;
  smallVehicles: number;
  largeVehicles: number;
  evVehicles: number;
}

export class ForecastService {
  private static baseVehicleCosts = {
    small: 35000,
    large: 75000,
    ev: 45000,
  };

  static async generateForecast(startYear: number = 2024, years: number = 11): Promise<ForecastData[]> {
    const parameters = await CostParametersService.getCurrentParameters();
    const forecast: ForecastData[] = [];

    for (let i = 0; i < years; i++) {
      const year = startYear + i;
      const yearData = this.calculateYearForecast(year, i, parameters);
      forecast.push(yearData);
    }

    return forecast;
  }

  private static calculateYearForecast(year: number, yearIndex: number, parameters: CostParameters): ForecastData {
    // Base vehicle counts (simplified model)
    const baseSmallVehicles = 120 + (yearIndex * 5);
    const baseLargeVehicles = 45 + (yearIndex * 2);
    
    // Apply EV transition ratios
    const evFromSmall = Math.floor(baseSmallVehicles * (parameters.smallToEvRatio / 100));
    const evFromLarge = Math.floor(baseLargeVehicles * (parameters.bigToEvRatio / 100));
    
    const smallVehicles = baseSmallVehicles - evFromSmall;
    const largeVehicles = baseLargeVehicles - evFromLarge;
    const evVehicles = evFromSmall + evFromLarge;

    // Calculate costs with tariff and inflation
    const tariffMultiplier = 1 + (parameters.tariffRate / 100);
    const inflationMultiplier = Math.pow(1 + (parameters.inflationRate / 100), yearIndex);
    
    const adjustedSmallCost = this.baseVehicleCosts.small * tariffMultiplier * inflationMultiplier;
    const adjustedLargeCost = this.baseVehicleCosts.large * tariffMultiplier * inflationMultiplier;
    const adjustedEvCost = this.baseVehicleCosts.ev * tariffMultiplier * inflationMultiplier;

    const totalSpending = (
      (smallVehicles * adjustedSmallCost) +
      (largeVehicles * adjustedLargeCost) +
      (evVehicles * adjustedEvCost)
    );

    const evSpending = evVehicles * adjustedEvCost;

    return {
      year: year.toString(),
      totalSpending: Math.round(totalSpending),
      evSpending: Math.round(evSpending),
      smallVehicles,
      largeVehicles,
      evVehicles,
    };
  }

  static async getCurrentMix(): Promise<{ name: string; value: number; color: string }[]> {
    const parameters = await CostParametersService.getCurrentParameters();
    
    // Calculate current fleet composition based on parameters
    const totalSmall = 520;
    const totalLarge = 207;
    const totalEv = Math.floor(
      (totalSmall * parameters.smallToEvRatio / 100) +
      (totalLarge * parameters.bigToEvRatio / 100)
    );

    return [
      { 
        name: 'Small Vehicles', 
        value: totalSmall - Math.floor(totalSmall * parameters.smallToEvRatio / 100), 
        color: 'rgba(59, 130, 246, 0.8)' 
      },
      { 
        name: 'Large Vehicles', 
        value: totalLarge - Math.floor(totalLarge * parameters.bigToEvRatio / 100), 
        color: 'rgba(147, 51, 234, 0.8)' 
      },
      { 
        name: 'Electric Vehicles', 
        value: totalEv, 
        color: 'rgba(34, 197, 94, 0.8)' 
      },
    ];
  }
}
