
import { useState } from 'react';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';

interface AuthContainerProps {
  onAuthSuccess: (username: string) => void;
}

const AuthContainer = ({ onAuthSuccess }: AuthContainerProps) => {
  const [showSignup, setShowSignup] = useState(false);

  const handleLogin = async (username: string, password: string, rememberMe: boolean): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock authentication - in real app, this would call your auth API
    if (username && password) {
      onAuthSuccess(username);
      return true;
    }
    return false;
  };

  const handleSignup = async (username: string, email: string, password: string, consent: boolean): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock authentication - in real app, this would call your auth API
    if (username && email && password && consent) {
      onAuthSuccess(username);
      return true;
    }
    return false;
  };

  if (showSignup) {
    return <SignupPage onSignup={handleSignup} />;
  }

  return <LoginPage onLogin={handleLogin} />;
};

export default AuthContainer;
