
import { useMemo } from "react";
import { Vehicle, ProcessedYearData, ViewType, ChartDataPoint, YearStats } from "@/types/vehicle";

export const useDateDrillDownData = (vehicles: Vehicle[], selectedYear: string, viewType: ViewType) => {
  const processedData = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const yearRange = Array.from({ length: 11 }, (_, i) => currentYear + i);
    
    const replacementData: ProcessedYearData[] = yearRange.map(year => {
      const replacements = vehicles.filter((v: Vehicle) => 
        parseInt(v.lcReplaceYear || '') === year
      );
      
      const totalValue = replacements.reduce((sum: number, v: Vehicle) => sum + (v.acquisitionValue || 0), 0);
      
      return {
        year: year.toString(),
        count: replacements.length,
        totalValue,
        vehicles: replacements,
        avgValue: replacements.length > 0 ? totalValue / replacements.length : 0
      };
    });

    const acquisitionData = vehicles.reduce((acc: Record<string, Vehicle[]>, vehicle: Vehicle) => {
      const year = vehicle.startUp;
      if (year) {
        if (!acc[year]) {
          acc[year] = [];
        }
        acc[year].push(vehicle);
      }
      return acc;
    }, {});

    return {
      replacementData: replacementData.filter(d => d.count > 0),
      acquisitionData,
      yearRange
    };
  }, [vehicles]);

  const filteredVehicles = useMemo(() => {
    if (selectedYear === "all") return vehicles;
    
    if (viewType === "replacements") {
      return vehicles.filter((v: Vehicle) => v.lcReplaceYear === selectedYear);
    } else if (viewType === "acquisitions") {
      return vehicles.filter((v: Vehicle) => v.startUp === selectedYear);
    }
    
    return vehicles;
  }, [vehicles, selectedYear, viewType]);

  const getChartData = (): ChartDataPoint[] => {
    if (viewType === "replacements") {
      return processedData.replacementData.map(d => ({
        year: d.year,
        value: d.count,
        spending: d.totalValue / 1000000 // Convert to millions
      }));
    }
    
    return Object.entries(processedData.acquisitionData).map(([year, vehs]) => ({
      year,
      value: Array.isArray(vehs) ? vehs.length : 0,
      spending: Array.isArray(vehs) ? vehs.reduce((sum: number, v: Vehicle) => sum + (v.acquisitionValue || 0), 0) / 1000000 : 0
    })).sort((a, b) => parseInt(a.year) - parseInt(b.year));
  };

  const getYearOptions = (): string[] => {
    const years = new Set<string>();
    
    if (viewType === "replacements") {
      vehicles.forEach((v: Vehicle) => {
        if (v.lcReplaceYear) years.add(v.lcReplaceYear);
      });
    } else {
      vehicles.forEach((v: Vehicle) => {
        if (v.startUp) years.add(v.startUp);
      });
    }
    
    return Array.from(years).sort();
  };

  const getStatsForSelectedYear = (): YearStats => {
    if (selectedYear === "all") {
      return {
        totalVehicles: filteredVehicles.length,
        totalValue: filteredVehicles.reduce((sum: number, v: Vehicle) => sum + (v.acquisitionValue || 0), 0),
        categories: filteredVehicles.reduce((acc: Record<string, number>, v: Vehicle) => {
          const category = v.category || 'Unknown';
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {})
      };
    }

    const yearData = processedData.replacementData.find(d => d.year === selectedYear);
    if (yearData) {
      return {
        totalVehicles: yearData.count,
        totalValue: yearData.totalValue,
        avgValue: yearData.avgValue,
        categories: yearData.vehicles.reduce((acc: Record<string, number>, v: Vehicle) => {
          const category = v.category || 'Unknown';
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {})
      };
    }

    return { totalVehicles: 0, totalValue: 0, categories: {} };
  };

  return {
    processedData,
    filteredVehicles,
    chartData: getChartData(),
    yearOptions: getYearOptions(),
    stats: getStatsForSelectedYear()
  };
};
