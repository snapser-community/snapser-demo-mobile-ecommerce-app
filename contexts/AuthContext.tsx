import { SnapserManager } from '@/services/SnapserManager';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type AuthContextType = {
  isAuthenticated: boolean;
  userId: string | null;
  login: (userId: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    let user = SnapserManager.getCurrentUser()
    if(user) {
      setIsAuthenticated(true);
      setUserId(user.id);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const login = (userId: string) => {
    setIsAuthenticated(true);
    setUserId(userId);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}