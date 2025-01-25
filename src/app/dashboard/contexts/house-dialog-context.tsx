import React, { createContext, useContext, useState, ReactNode } from 'react';

type ChatType = 'Property' | 'Location' | 'Financial' | 'Main';

interface HouseDialogContextType {
  currentChat: ChatType;
  setCurrentChat: (chat: ChatType) => void;
}

const HouseDialogContext = createContext<HouseDialogContextType | undefined>(undefined);

export function HouseDialogProvider({ children }: { children: ReactNode }) {
  const [currentChat, setCurrentChat] = useState<ChatType>('Main');

  return (
    <HouseDialogContext.Provider value={{ currentChat, setCurrentChat }}>
      {children}
    </HouseDialogContext.Provider>
  );
}

export function useHouseDialog() {
  const context = useContext(HouseDialogContext);
  if (context === undefined) {
    throw new Error('useHouseDialog must be used within a HouseDialogProvider');
  }
  return context;
}