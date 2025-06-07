
import { UserRole } from '@/types/vehicle';

export class AuthService {
  static getCurrentUserRole(): UserRole {
    // In production, this would fetch from your auth system
    const role = localStorage.getItem('userRole') as 'Admin' | 'Manager' | 'Clerk' || 'Admin';
    
    return {
      role,
      canEditParameters: role === 'Admin' || role === 'Manager',
    };
  }

  static getCurrentUser() {
    return {
      id: 'user-123',
      name: 'John Doe',
      email: 'john@company.com',
      role: this.getCurrentUserRole().role,
    };
  }

  static setUserRole(role: 'Admin' | 'Manager' | 'Clerk') {
    localStorage.setItem('userRole', role);
  }
}
