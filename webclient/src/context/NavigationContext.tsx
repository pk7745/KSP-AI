import React, { createContext, useContext, useState } from 'react';

interface NavigationContextType {
  currentView: string;
  setCurrentView: (view: string) => void;
  goBack: () => void;
  globalCaseId: string | null;
  openCase360: (caseId: string) => void;
  clearGlobalCase: () => void;
}

const NavigationContext = createContext<NavigationContextType>({
  currentView: 'dashboard',
  setCurrentView: () => {},
  goBack: () => {},
  globalCaseId: null,
  openCase360: () => {},
  clearGlobalCase: () => {}
});

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [historyStack, setHistoryStack] = useState<string[]>([]);
  const [globalCaseId, setGlobalCaseId] = useState<string | null>(null);

  const changeView = (newView: string) => {
    if (newView !== currentView) {
      setHistoryStack(prev => [...prev, currentView]);
      setCurrentView(newView);
    }
  };

  const goBack = () => {
    if (historyStack.length > 0) {
      const prevView = historyStack[historyStack.length - 1];
      setHistoryStack(prev => prev.slice(0, prev.length - 1));
      setCurrentView(prevView);
    } else {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        setCurrentView('home');
      }
    }
  };

  const openCase360 = (caseId: string) => {
    setGlobalCaseId(caseId);
    changeView('cases');
  };

  const clearGlobalCase = () => {
    setGlobalCaseId(null);
  };

  return (
    <NavigationContext.Provider value={{ currentView, setCurrentView: changeView, goBack, globalCaseId, openCase360, clearGlobalCase }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => useContext(NavigationContext);
