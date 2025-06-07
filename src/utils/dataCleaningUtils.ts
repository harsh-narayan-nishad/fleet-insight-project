
export interface CleaningReport {
  totalRecords: number;
  cleanRecords: number;
  issuesFound: number;
  missingLicensePlates: number;
  invalidDates: number;
  invalidValues: number;
}

export interface ValidationIssue {
  id: string;
  field: string;
  issue: string;
  severity: 'error' | 'warning';
  originalValue: any;
  suggestedValue?: any;
}

export const validateVehicleData = (vehicles: any[]): { cleanedData: any[], issues: ValidationIssue[], report: CleaningReport } => {
  const issues: ValidationIssue[] = [];
  const cleanedData = [];
  
  let missingLicensePlates = 0;
  let invalidDates = 0;
  let invalidValues = 0;

  for (let i = 0; i < vehicles.length; i++) {
    const vehicle = { ...vehicles[i] };
    let hasIssues = false;

    // Check license plate
    if (!vehicle.licensePlate || vehicle.licensePlate.trim() === '' || vehicle.licensePlate === 'NO PLATE') {
      missingLicensePlates++;
      issues.push({
        id: `${vehicle.id || i}-license`,
        field: 'licensePlate',
        issue: 'Missing or invalid license plate',
        severity: 'warning',
        originalValue: vehicle.licensePlate,
        suggestedValue: `TEMP-${String(i + 1).padStart(3, '0')}`
      });
      vehicle.licensePlate = vehicle.licensePlate || `TEMP-${String(i + 1).padStart(3, '0')}`;
    }

    // Validate dates
    if (vehicle.lcReplaceDate) {
      const date = new Date(vehicle.lcReplaceDate);
      if (isNaN(date.getTime())) {
        invalidDates++;
        issues.push({
          id: `${vehicle.id || i}-date`,
          field: 'lcReplaceDate',
          issue: 'Invalid date format',
          severity: 'error',
          originalValue: vehicle.lcReplaceDate
        });
        hasIssues = true;
      }
    }

    // Validate acquisition value
    if (vehicle.acquisitionValue && (isNaN(vehicle.acquisitionValue) || vehicle.acquisitionValue < 0)) {
      invalidValues++;
      issues.push({
        id: `${vehicle.id || i}-value`,
        field: 'acquisitionValue',
        issue: 'Invalid acquisition value',
        severity: 'error',
        originalValue: vehicle.acquisitionValue,
        suggestedValue: 0
      });
      vehicle.acquisitionValue = 0;
    }

    // Validate start year
    if (vehicle.startUp) {
      const year = parseInt(vehicle.startUp);
      if (isNaN(year) || year < 1900 || year > new Date().getFullYear() + 1) {
        invalidValues++;
        issues.push({
          id: `${vehicle.id || i}-year`,
          field: 'startUp',
          issue: 'Invalid start year',
          severity: 'warning',
          originalValue: vehicle.startUp,
          suggestedValue: new Date().getFullYear()
        });
      }
    }

    cleanedData.push(vehicle);
  }

  const report: CleaningReport = {
    totalRecords: vehicles.length,
    cleanRecords: vehicles.length - issues.filter(i => i.severity === 'error').length,
    issuesFound: issues.length,
    missingLicensePlates,
    invalidDates,
    invalidValues
  };

  return { cleanedData, issues, report };
};

export const categorizeVehicles = (vehicles: any[]) => {
  return vehicles.reduce((acc, vehicle) => {
    const category = vehicle.category || 'Unknown';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(vehicle);
    return acc;
  }, {} as Record<string, any[]>);
};

export const generateReplacementSchedule = (vehicles: any[]) => {
  const currentYear = new Date().getFullYear();
  const schedule = [];

  for (const vehicle of vehicles) {
    if (vehicle.lcReplaceYear) {
      const replaceYear = parseInt(vehicle.lcReplaceYear);
      if (replaceYear >= currentYear && replaceYear <= currentYear + 10) {
        schedule.push({
          year: replaceYear,
          vehicle: vehicle,
          priority: replaceYear === currentYear ? 'high' : replaceYear <= currentYear + 2 ? 'medium' : 'low'
        });
      }
    }
  }

  return schedule.sort((a, b) => a.year - b.year);
};
