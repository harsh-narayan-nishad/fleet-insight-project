
import { CostParameters, CostParameterHistory } from '@/types/vehicle';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export class CostParametersService {
  private static async fetchWithAuth(url: string, options: RequestInit = {}) {
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
      console.error('Error fetching cost parameters:', error);
      // Return default values if API fails
      return {
        inflationRate: 3.2,
        tariffRate: 2.5,
        smallToEvRatio: 25,
        bigToEvRatio: 15,
      };
    }
  }

  static async updateParameters(parameters: Omit<CostParameters, 'id' | 'updatedBy' | 'updatedAt'>): Promise<CostParameters> {
    const response = await this.fetchWithAuth('/api/settings/cost-parameters', {
      method: 'PUT',
      body: JSON.stringify(parameters),
    });

    if (!response.ok) {
      throw new Error(`Failed to update parameters: ${response.statusText}`);
    }

    return await response.json();
  }

  static async getParameterHistory(): Promise<CostParameterHistory[]> {
    const response = await this.fetchWithAuth('/api/settings/cost-parameters/history');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch parameter history: ${response.statusText}`);
    }

    return await response.json();
  }

  static async revertToParameters(historyId: string): Promise<CostParameters> {
    const response = await this.fetchWithAuth(`/api/settings/cost-parameters/revert/${historyId}`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(`Failed to revert parameters: ${response.statusText}`);
    }

    return await response.json();
  }
}
