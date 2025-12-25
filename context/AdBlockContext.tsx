
import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdBlockContextType {
  adBlockActive: boolean;
  toggleAdBlock: () => void;
}

const AdBlockContext = createContext<AdBlockContextType | undefined>(undefined);

export const AdBlockProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adBlockActive, setAdBlockActive] = useState<boolean>(() => {
    return localStorage.getItem('ad_block_enabled') === 'true';
  });

  const toggleAdBlock = () => {
    setAdBlockActive(prev => {
      const newState = !prev;
      localStorage.setItem('ad_block_enabled', String(newState));
      return newState;
    });
  };

  return (
    <AdBlockContext.Provider value={{ adBlockActive, toggleAdBlock }}>
      {children}
    </AdBlockContext.Provider>
  );
};

export const useAdBlock = () => {
  const context = useContext(AdBlockContext);
  if (context === undefined) {
    throw new Error('useAdBlock must be used within an AdBlockProvider');
  }
  return context;
};
