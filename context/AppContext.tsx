'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';
type SidebarState = 'expanded' | 'collapsed';

type AppContextType = {
  theme: Theme;
  sidebarState: SidebarState;
  toggleTheme: () => void;
  toggleSidebar: () => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [sidebarState, setSidebarState] = useState<SidebarState>('expanded');
  const [mounted, setMounted] = useState(false);

  // Load saved preferences from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const savedSidebarState = localStorage.getItem('sidebarState') as SidebarState | null;
    
    if (savedTheme) setTheme(savedTheme);
    if (savedSidebarState) setSidebarState(savedSidebarState);
    
    // Add theme class to document element
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const toggleSidebar = () => {
    const newState = sidebarState === 'expanded' ? 'collapsed' : 'expanded';
    setSidebarState(newState);
    localStorage.setItem('sidebarState', newState);
  };

  // Don't render until we've loaded the saved preferences
  if (!mounted) return null;

  return (
    <AppContext.Provider value={{ theme, sidebarState, toggleTheme, toggleSidebar }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
