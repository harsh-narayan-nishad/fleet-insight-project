
import { FleetVehicle, DrillThroughFilter, ChartDataPoint } from '@/types/fleet';

export class FleetDataService {
  private static vehicles: FleetVehicle[] = [
    {
      id: "1",
      equipment: "87JD-1",
      equipmentDescription: "Fire Truck Ladder 1",
      systemStatus: "In Service",
      lhp: "Heavy Vehicle",
      location: "Station 1",
      licenseNumber: "87JD-1",
      startUp: "1992",
      acquisitionValue: 210000.00,
      lifeCycle: 21,
      lcReplaceYear: "2027",
      replacementCost2024_2035: 350000,
      forecastSpend2025_2035: 380000,
      forecastCount2025_2035: 1,
      radioSpend2026_2035: 15000,
      radioCount2026_2035: 1,
      radioEquipment: "Motorola XPR 7550",
      serviceStatus: "ready_for_service",
      source: "dummy-data"
    },
    {
      id: "2", 
      equipment: "13GT-5",
      equipmentDescription: "Ambulance Unit 5",
      systemStatus: "In Service",
      lhp: "Light Vehicle",
      location: "Station 2",
      licenseNumber: "13GT-5",
      startUp: "1992",
      acquisitionValue: 210000.00,
      lifeCycle: 21,
      lcReplaceYear: "2029",
      replacementCost2024_2035: 280000,
      forecastSpend2025_2035: 295000,
      forecastCount2025_2035: 1,
      radioSpend2026_2035: 12000,
      radioCount2026_2035: 1,
      radioEquipment: "Motorola XPR 6550",
      serviceStatus: "ready_for_service",
      source: "dummy-data"
    },
    {
      id: "3",
      equipment: "TAC48X",
      equipmentDescription: "Tactical Response Vehicle",
      systemStatus: "Running",
      lhp: "Light Vehicle",
      location: "Station 3",
      licenseNumber: "TAC48X",
      startUp: "2004",
      acquisitionValue: 4200.00,
      lifeCycle: 21,
      lcReplaceYear: "2029",
      replacementCost2024_2035: 85000,
      forecastSpend2025_2035: 88000,
      forecastCount2025_2035: 1,
      radioSpend2026_2035: 8000,
      radioCount2026_2035: 1,
      radioEquipment: "Kenwood NX-5700",
      serviceStatus: "ready_for_service",
      source: "dummy-data"
    },
    {
      id: "4",
      equipment: "NO PLATE",
      equipmentDescription: "Emergency Generator Unit",
      systemStatus: "DIE",
      lhp: "Powered",
      location: "Maintenance",
      licenseNumber: "",
      startUp: "1970",
      acquisitionValue: 150000.00,
      lifeCycle: 25,
      lcReplaceYear: "2027",
      replacementCost2024_2035: 200000,
      forecastSpend2025_2035: 210000,
      forecastCount2025_2035: 1,
      radioSpend2026_2035: 0,
      radioCount2026_2035: 0,
      radioEquipment: "",
      serviceStatus: "not_in_service",
      source: "dummy-data"
    },
    {
      id: "5",
      equipment: "XR989A",
      equipmentDescription: "Electric Fire Truck",
      systemStatus: "In Service", 
      lhp: "Heavy Vehicle",
      location: "Station 4",
      licenseNumber: "XR989A",
      startUp: "2009",
      acquisitionValue: 258215.34,
      lifeCycle: 11,
      lcReplaceYear: "2029",
      replacementCost2024_2035: 450000,
      forecastSpend2025_2035: 475000,
      forecastCount2025_2035: 1,
      radioSpend2026_2035: 18000,
      radioCount2026_2035: 2,
      radioEquipment: "Motorola XPR 7580e",
      serviceStatus: "ready_for_service",
      source: "dummy-data"
    },
    {
      id: "6",
      equipment: "EV-101",
      equipmentDescription: "Electric Response Unit",
      systemStatus: "In Service",
      lhp: "Light Vehicle",
      location: "Station 5",
      licenseNumber: "EV-101",
      startUp: "2020",
      acquisitionValue: 45000.00,
      lifeCycle: 15,
      lcReplaceYear: "2030",
      replacementCost2024_2035: 65000,
      forecastSpend2025_2035: 68000,
      forecastCount2025_2035: 1,
      radioSpend2026_2035: 10000,
      radioCount2026_2035: 1,
      radioEquipment: "Kenwood NX-3700",
      serviceStatus: "ready_for_service",
      source: "dummy-data"
    }
  ];

  static getAllVehicles(): FleetVehicle[] {
    return this.vehicles;
  }

  static getVehiclesByFilter(filters: DrillThroughFilter[]): FleetVehicle[] {
    return this.vehicles.filter(vehicle => {
      return filters.every(filter => {
        const value = vehicle[filter.field];
        switch (filter.operator || 'equals') {
          case 'equals':
            return value === filter.value;
          case 'contains':
            return String(value).toLowerCase().includes(String(filter.value).toLowerCase());
          case 'greater_than':
            return Number(value) > Number(filter.value);
          case 'less_than':
            return Number(value) < Number(filter.value);
          default:
            return value === filter.value;
        }
      });
    });
  }

  static getReplacementCostTrend(): ChartDataPoint[] {
    const yearData: Record<string, { value: number; count: number; vehicles: FleetVehicle[] }> = {};
    
    this.vehicles.forEach(vehicle => {
      if (vehicle.lcReplaceYear && vehicle.replacementCost2024_2035) {
        const year = vehicle.lcReplaceYear;
        if (!yearData[year]) {
          yearData[year] = { value: 0, count: 0, vehicles: [] };
        }
        yearData[year].value += vehicle.replacementCost2024_2035;
        yearData[year].count += 1;
        yearData[year].vehicles.push(vehicle);
      }
    });

    return Object.entries(yearData)
      .map(([year, data]) => ({
        year,
        value: data.value,
        count: data.count,
        rawData: data.vehicles
      }))
      .sort((a, b) => a.year.localeCompare(b.year));
  }

  static getForecastSpendVsReplacement(): ChartDataPoint[] {
    const yearData: Record<string, { forecast: number; replacement: number; vehicles: FleetVehicle[] }> = {};
    
    this.vehicles.forEach(vehicle => {
      if (vehicle.lcReplaceYear) {
        const year = vehicle.lcReplaceYear;
        if (!yearData[year]) {
          yearData[year] = { forecast: 0, replacement: 0, vehicles: [] };
        }
        yearData[year].forecast += vehicle.forecastSpend2025_2035 || 0;
        yearData[year].replacement += vehicle.replacementCost2024_2035 || 0;
        yearData[year].vehicles.push(vehicle);
      }
    });

    return Object.entries(yearData)
      .map(([year, data]) => ({
        year,
        value: data.forecast + data.replacement, // Add value property
        forecast: data.forecast,
        replacement: data.replacement,
        rawData: data.vehicles
      }))
      .sort((a, b) => a.year.localeCompare(b.year));
  }

  static getVehicleClassBreakdown(): ChartDataPoint[] {
    const classData: Record<string, { value: number; count: number; vehicles: FleetVehicle[] }> = {};
    
    this.vehicles.forEach(vehicle => {
      const category = vehicle.lhp || 'Unknown';
      if (!classData[category]) {
        classData[category] = { value: 0, count: 0, vehicles: [] };
      }
      classData[category].value += vehicle.forecastCount2025_2035 || 0;
      classData[category].count += 1;
      classData[category].vehicles.push(vehicle);
    });

    return Object.entries(classData).map(([category, data]) => ({
      year: category,
      value: data.value,
      count: data.count,
      category,
      rawData: data.vehicles
    }));
  }

  static getRadioSpendBreakdown(): ChartDataPoint[] {
    const radioData: Record<string, { value: number; count: number; vehicles: FleetVehicle[] }> = {};
    
    this.vehicles.forEach(vehicle => {
      if (vehicle.lcReplaceYear && vehicle.radioSpend2026_2035) {
        const year = vehicle.lcReplaceYear;
        if (!radioData[year]) {
          radioData[year] = { value: 0, count: 0, vehicles: [] };
        }
        radioData[year].value += vehicle.radioSpend2026_2035;
        radioData[year].count += vehicle.radioCount2026_2035 || 0;
        radioData[year].vehicles.push(vehicle);
      }
    });

    return Object.entries(radioData)
      .map(([year, data]) => ({
        year,
        value: data.value,
        count: data.count,
        rawData: data.vehicles
      }))
      .sort((a, b) => a.year.localeCompare(b.year));
  }

  static getTop10MostExpensive(): ChartDataPoint[] {
    return this.vehicles
      .filter(vehicle => vehicle.acquisitionValue && vehicle.acquisitionValue > 0)
      .sort((a, b) => (b.acquisitionValue || 0) - (a.acquisitionValue || 0))
      .slice(0, 10)
      .map(vehicle => ({
        year: vehicle.equipmentDescription || vehicle.equipment || 'Unknown',
        value: vehicle.acquisitionValue || 0,
        label: vehicle.equipmentDescription,
        rawData: [vehicle]
      }));
  }

  static getPendingVehicles(): FleetVehicle[] {
    return this.vehicles.filter(vehicle => vehicle.serviceStatus === 'not_in_service');
  }
}
