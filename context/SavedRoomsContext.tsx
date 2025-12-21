
import React, { createContext, useContext, useState, useEffect } from 'react';

interface SavedRoomsContextType {
  savedIds: string[];
  toggleSave: (id: string) => void;
  isSaved: (id: string) => boolean;
}

const SavedRoomsContext = createContext<SavedRoomsContextType | undefined>(undefined);

export const SavedRoomsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('savedRooms');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('savedRooms', JSON.stringify(savedIds));
  }, [savedIds]);

  const toggleSave = (id: string) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const isSaved = (id: string) => savedIds.includes(id);

  return (
    <SavedRoomsContext.Provider value={{ savedIds, toggleSave, isSaved }}>
      {children}
    </SavedRoomsContext.Provider>
  );
};

export const useSavedRooms = () => {
  const context = useContext(SavedRoomsContext);
  if (context === undefined) {
    throw new Error('useSavedRooms must be used within a SavedRoomsProvider');
  }
  return context;
};
