import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export type Role = 'IO' | 'SHO' | 'DSP' | 'ADMIN';

export interface User {
  employeeId: string;
  name: string;
  role: Role;
  designation: string;
  rank: string;
  unitId: string;
  unitName: string;
  districtId: string;
  districtName: string;
  email?: string;
  phone?: string;
  language?: 'en' | 'kn';
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Read from sessionStorage for auto-logout when website/tab is closed
    const savedUser = sessionStorage.getItem('ksp_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (userData: User) => {
    sessionStorage.setItem('ksp_user', JSON.stringify(userData));
    localStorage.removeItem('ksp_user'); // Purge legacy localStorage
    setUser(userData);
  };

  const logout = () => {
    sessionStorage.removeItem('ksp_user');
    sessionStorage.removeItem('ksp_token');
    localStorage.removeItem('ksp_user');
    localStorage.removeItem('ksp_token');
    setUser(null);
  };

  const updateUser = (data: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...data };
      sessionStorage.setItem('ksp_user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
