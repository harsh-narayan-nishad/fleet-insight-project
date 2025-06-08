
export interface FleetVehicle {
  id?: string;
  replaced?: string;
  equipment?: string;
  systemStatus?: string;
  equipmentDescription?: string; // vehicle_name
  objectType?: string;
  lhp?: 'Light Vehicle' | 'Heavy Vehicle' | 'Powered';
  location?: string;
  sortField?: string;
  conY?: string;
  cm?: string;
  mfr?: string;
  modelNumber?: string;
  technicalIdentNo?: string;
  licenseNumber?: string;
  startUp?: string;
  manParNo?: string;
  mnWkCtr?: string;
  acquisitionValue?: number;
  lifeCycle?: number;
  depYears?: number;
  depYearsJS?: number;
  depYearsMatch?: boolean;
  lcReplaceDate?: string;
  financeAdjustment?: number;
  lcReplaceYear?: string;
  projectedPriceAtReplacement?: number;
  radioEquipment?: string;
  replacementCost2024_2035?: number;
  forecastSpend2025_2035?: number;
  forecastCount2025_2035?: number;
  radioSpend2026_2035?: number;
  radioCount2026_2035?: number;
  inventoryNo?: string;
  manufacturingSerialNumber?: string;
  gross?: number;
  order?: string;
  wbsElement?: string;
  lobFromLocation?: string;
  
  // Audit fields
  createdAt?: string;
  updatedAt?: string;
  source?: string;
  serviceStatus?: 'ready_for_service' | 'not_in_service';
}

export interface DrillThroughFilter {
  field: keyof FleetVehicle;
  value: any;
  operator?: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'between';
}

export interface ChartDataPoint {
  year: string | number;
  value: number;
  count?: number;
  category?: string;
  label?: string;
  rawData?: FleetVehicle[];
}

export interface DrillThroughData {
  title: string;
  filters: DrillThroughFilter[];
  vehicles: FleetVehicle[];
  totalValue?: number;
  totalCount?: number;
}

export interface UserRole {
  role: 'Clerk' | 'Analyst' | 'Manager';
  permissions: {
    canUpload: boolean;
    canDrillThrough: boolean;
    canExport: boolean;
    canManageUsers: boolean;
    canConfigureETL: boolean;
  };
}
