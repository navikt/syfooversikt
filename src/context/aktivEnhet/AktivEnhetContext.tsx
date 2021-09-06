import React, { useState } from 'react';

type AktivEnhetProviderProps = {
  children: React.ReactNode;
};

type AktivEnhetContextState = {
  handleAktivEnhetChanged: (enhetId: string) => void;
  aktivEnhet?: string;
};

export const AktivEnhetContext = React.createContext<
  AktivEnhetContextState | undefined
>(undefined);

export const AktivEnhetProvider = ({ children }: AktivEnhetProviderProps) => {
  const [aktivEnhet, setAktivEnhet] = useState<string>();
  return (
    <AktivEnhetContext.Provider
      value={{
        aktivEnhet,
        handleAktivEnhetChanged: (enhetId) => setAktivEnhet(enhetId),
      }}
    >
      {children}
    </AktivEnhetContext.Provider>
  );
};

export const useAktivEnhet = () => {
  const context = React.useContext(AktivEnhetContext);
  if (!context) {
    throw new Error(`useAktivEnhet must be used within a AktivEnhetProvider`);
  }
  return context;
};
