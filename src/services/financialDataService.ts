
import { 
  EquipmentCategory, 
  VehiclePriceHistory, 
  ForecastScenario, 
  CSVExportData 
} from '@/types/financial';
import { CostParameters } from '@/types/vehicle';

export class FinancialDataService {
  private static readonly STORAGE_KEYS = {
    EQUIPMENT_CATEGORIES: 'financial_equipment_categories',
    PRICE_HISTORY: 'financial_price_history',
    FORECAST_SCENARIOS: 'financial_forecast_scenarios',
    COST_PARAMETERS: 'financial_cost_parameters',
  };

  // Equipment Categories Management
  static getEquipmentCategories(): EquipmentCategory[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.EQUIPMENT_CATEGORIES);
      return data ? JSON.parse(data) : this.getDefaultCategories();
    } catch (error) {
      console.error('Error loading equipment categories:', error);
      return this.getDefaultCategories();
    }
  }

  static saveEquipmentCategories(categories: EquipmentCategory[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEYS.EQUIPMENT_CATEGORIES, JSON.stringify(categories));
    } catch (error) {
      console.error('Error saving equipment categories:', error);
      throw new Error('Failed to save equipment categories');
    }
  }

  static addEquipmentCategory(category: Omit<EquipmentCategory, 'id' | 'createdAt' | 'updatedAt'>): EquipmentCategory {
    const categories = this.getEquipmentCategories();
    const newCategory: EquipmentCategory = {
      ...category,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    categories.push(newCategory);
    this.saveEquipmentCategories(categories);
    return newCategory;
  }

  static updateEquipmentCategory(id: string, updates: Partial<EquipmentCategory>): EquipmentCategory {
    const categories = this.getEquipmentCategories();
    const index = categories.findIndex(cat => cat.id === id);
    
    if (index === -1) {
      throw new Error('Equipment category not found');
    }

    categories[index] = {
      ...categories[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.saveEquipmentCategories(categories);
    return categories[index];
  }

  static deleteEquipmentCategory(id: string): void {
    const categories = this.getEquipmentCategories();
    const filtered = categories.filter(cat => cat.id !== id);
    this.saveEquipmentCategories(filtered);
  }

  // Vehicle Price History Management
  static getPriceHistory(): VehiclePriceHistory[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.PRICE_HISTORY);
      return data ? JSON.parse(data) : this.getDefaultPriceHistory();
    } catch (error) {
      console.error('Error loading price history:', error);
      return this.getDefaultPriceHistory();
    }
  }

  static savePriceHistory(history: VehiclePriceHistory[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEYS.PRICE_HISTORY, JSON.stringify(history));
    } catch (error) {
      console.error('Error saving price history:', error);
      throw new Error('Failed to save price history');
    }
  }

  static addPriceEntry(entry: Omit<VehiclePriceHistory, 'id' | 'createdAt' | 'updatedAt'>): VehiclePriceHistory {
    const history = this.getPriceHistory();
    const newEntry: VehiclePriceHistory = {
      ...entry,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    history.push(newEntry);
    this.savePriceHistory(history);
    return newEntry;
  }

  // Forecast Scenarios Management
  static getForecastScenarios(): ForecastScenario[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.FORECAST_SCENARIOS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading forecast scenarios:', error);
      return [];
    }
  }

  static saveForecastScenarios(scenarios: ForecastScenario[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEYS.FORECAST_SCENARIOS, JSON.stringify(scenarios));
    } catch (error) {
      console.error('Error saving forecast scenarios:', error);
      throw new Error('Failed to save forecast scenarios');
    }
  }

  // CSV Export Functions
  static exportToCSV(type: CSVExportData['type']): string {
    let data: any[] = [];
    let filename = '';

    switch (type) {
      case 'cost-parameters':
        // Get current cost parameters from the existing service
        data = [this.getCurrentCostParameters()];
        filename = `cost-parameters-${new Date().toISOString().split('T')[0]}.csv`;
        break;
      case 'equipment-categories':
        data = this.getEquipmentCategories();
        filename = `equipment-categories-${new Date().toISOString().split('T')[0]}.csv`;
        break;
      case 'price-history':
        data = this.getPriceHistory();
        filename = `price-history-${new Date().toISOString().split('T')[0]}.csv`;
        break;
      case 'forecast-results':
        data = this.getForecastScenarios();
        filename = `forecast-scenarios-${new Date().toISOString().split('T')[0]}.csv`;
        break;
      default:
        throw new Error('Invalid export type');
    }

    return this.convertToCSV(data, filename);
  }

  static importFromCSV(csvData: string, type: CSVExportData['type']): void {
    try {
      const parsed = this.parseCSV(csvData);
      
      switch (type) {
        case 'equipment-categories':
          this.saveEquipmentCategories(parsed as EquipmentCategory[]);
          break;
        case 'price-history':
          this.savePriceHistory(parsed as VehiclePriceHistory[]);
          break;
        case 'forecast-results':
          this.saveForecastScenarios(parsed as ForecastScenario[]);
          break;
        default:
          throw new Error('Invalid import type');
      }
    } catch (error) {
      console.error('Error importing CSV:', error);
      throw new Error('Failed to import CSV data');
    }
  }

  // Helper Methods
  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private static getDefaultCategories(): EquipmentCategory[] {
    return [
      {
        id: 'cat-1',
        name: 'Small Vehicles',
        type: 'vehicle',
        defaultLifespan: 8,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'cat-2',
        name: 'Large Vehicles',
        type: 'vehicle',
        defaultLifespan: 12,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'cat-3',
        name: 'Electric Vehicles',
        type: 'vehicle',
        defaultLifespan: 10,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  private static getDefaultPriceHistory(): VehiclePriceHistory[] {
    return [
      {
        id: 'price-1',
        category: 'Small Vehicles',
        year: 2024,
        basePrice: 35000,
        evPrice: 45000,
        source: 'Market Analysis',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'price-2',
        category: 'Large Vehicles',
        year: 2024,
        basePrice: 75000,
        evPrice: 95000,
        source: 'Market Analysis',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  private static getCurrentCostParameters(): any {
    // This would integrate with the existing cost parameters service
    return {
      inflationRate: 3.2,
      tariffRate: 2.5,
      smallToEvRatio: 25,
      bigToEvRatio: 15,
      exportedAt: new Date().toISOString(),
    };
  }

  private static convertToCSV(data: any[], filename: string): string {
    if (data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
        }).join(',')
      )
    ].join('\n');

    return csvContent;
  }

  private static parseCSV(csvData: string): any[] {
    const lines = csvData.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      const obj: any = {};
      headers.forEach((header, index) => {
        obj[header] = values[index] || '';
      });
      return obj;
    });
  }
}
