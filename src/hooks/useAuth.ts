
import { useState } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<string>('');

  const login = (username: string) => {
    setIsAuthenticated(true);
    setCurrentUser(username);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser('');
  };

  return {
    isAuthenticated,
    currentUser,
    login,
    logout,
  };
};
