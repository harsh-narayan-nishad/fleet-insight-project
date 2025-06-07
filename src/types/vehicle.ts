
export interface Vehicle {
  id?: string;
  licensePlate: string;
  lcReplaceYear?: string;
  startUp?: string;
  acquisitionValue?: number;
  category?: string;
  status?: string;
}

export interface ProcessedYearData {
  year: string;
  count: number;
  totalValue: number;
  vehicles: Vehicle[];
  avgValue: number;
}

export interface DateDrillDownProps {
  vehicles: Vehicle[];
}

export type ViewType = "replacements" | "acquisitions" | "spending";

export interface ChartDataPoint {
  year: string;
  value: number;
  spending: number;
}

export interface YearStats {
  totalVehicles: number;
  totalValue: number;
  avgValue?: number;
  categories: Record<string, number>;
}

export interface CostParameters {
  id?: string;
  inflationRate: number;
  tariffRate: number;
  smallToEvRatio: number;
  bigToEvRatio: number;
  updatedBy?: string;
  updatedAt?: string;
  isActive?: boolean;
}

export interface CostParameterHistory {
  id: string;
  inflationRate: number;
  tariffRate: number;
  smallToEvRatio: number;
  bigToEvRatio: number;
  updatedBy: string;
  updatedAt: string;
  revertedAt?: string;
}

export interface UserRole {
  role: 'Admin' | 'Manager' | 'Clerk';
  canEditParameters: boolean;
}
