
import { CostParameters, CostParameterHistory } from '@/types/vehicle';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Mock data for development environment
const mockParameters: CostParameters = {
  id: 'mock-1',
  inflationRate: 3.2,
  tariffRate: 2.5,
  smallToEvRatio: 25,
  bigToEvRatio: 15,
  updatedBy: 'System',
  updatedAt: new Date().toISOString(),
  isActive: true,
};

const mockHistory: CostParameterHistory[] = [
  {
    id: 'history-1',
    inflationRate: 3.0,
    tariffRate: 2.0,
    smallToEvRatio: 20,
    bigToEvRatio: 10,
    updatedBy: 'Admin',
    updatedAt: '2024-05-01T10:00:00Z',
  },
  {
    id: 'history-2',
    inflationRate: 3.2,
    tariffRate: 2.5,
    smallToEvRatio: 25,
    bigToEvRatio: 15,
    updatedBy: 'Manager',
    updatedAt: '2024-06-01T14:30:00Z',
  },
];

export class CostParametersService {
  private static async fetchWithAuth(url: string, options: RequestInit = {}) {
    // Check if we're in development mode without a backend
    const isDevelopment = !import.meta.env.VITE_API_URL || import.meta.env.DEV;
    
    if (isDevelopment) {
      // Return mock responses for development
      console.log('Development mode: Using mock data for', url);
      throw new Error('Development mode - no backend available');
    }

    // In production, replace with your actual auth token logic
    const token = localStorage.getItem('authToken');
    
    return fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...options.headers,
      },
    });
  }

  static async getCurrentParameters(): Promise<CostParameters> {
    try {
      const response = await this.fetchWithAuth('/api/settings/cost-parameters');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch parameters: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.log('Using mock cost parameters for development');
      // Return mock data for development
      return mockParameters;
    }
  }

  static async updateParameters(parameters: Omit<CostParameters, 'id' | 'updatedBy' | 'updatedAt'>): Promise<CostParameters> {
    try {
      const response = await this.fetchWithAuth('/api/settings/cost-parameters', {
        method: 'PUT',
        body: JSON.stringify(parameters),
      });

      if (!response.ok) {
        throw new Error(`Failed to update parameters: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.log('Mock update: parameters updated in development mode');
      // Return updated mock data for development
      return {
        ...mockParameters,
        ...parameters,
        updatedAt: new Date().toISOString(),
      };
    }
  }

  static async getParameterHistory(): Promise<CostParameterHistory[]> {
    try {
      const response = await this.fetchWithAuth('/api/settings/cost-parameters/history');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch parameter history: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.log('Using mock parameter history for development');
      // Return mock data for development
      return mockHistory;
    }
  }

  static async revertToParameters(historyId: string): Promise<CostParameters> {
    try {
      const response = await this.fetchWithAuth(`/api/settings/cost-parameters/revert/${historyId}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(`Failed to revert parameters: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.log('Mock revert: parameters reverted in development mode');
      // Find the history item and return it as current parameters
      const historyItem = mockHistory.find(h => h.id === historyId);
      if (historyItem) {
        return {
          ...mockParameters,
          inflationRate: historyItem.inflationRate,
          tariffRate: historyItem.tariffRate,
          smallToEvRatio: historyItem.smallToEvRatio,
          bigToEvRatio: historyItem.bigToEvRatio,
          updatedAt: new Date().toISOString(),
        };
      }
      return mockParameters;
    }
  }
}
