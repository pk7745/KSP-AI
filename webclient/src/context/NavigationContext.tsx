import React, { createContext, useContext, useState } from 'react';

interface NavigationContextType {
  currentView: string;
  setCurrentView: (view: string) => void;
  globalCaseId: string | null;
  openCase360: (caseId: string) => void;
  clearGlobalCase: () => void;
}

const NavigationContext = createContext<NavigationContextType>({
  currentView: 'home',
  setCurrentView: () => {},
  globalCaseId: null,
  openCase360: () => {},
  clearGlobalCase: () => {}
});

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [globalCaseId, setGlobalCaseId] = useState<string | null>(null);

  const openCase360 = (caseId: string) => {
    setGlobalCaseId(caseId);
    setCurrentView('cases');
  };

  const clearGlobalCase = () => {
    setGlobalCaseId(null);
  };

  return (
    <NavigationContext.Provider value={{ currentView, setCurrentView, globalCaseId, openCase360, clearGlobalCase }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => useContext(NavigationContext);
