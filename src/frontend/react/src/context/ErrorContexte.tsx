import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ErrorMessageContextType {
  errorMessage: {
    message: string;
    type: string;
  };
  setErrorMessage: React.Dispatch<React.SetStateAction<{
    message: string;
    type: string;
  }>>;
}

const ErrorMessageContext = createContext<ErrorMessageContextType | null>(null);

export const ErrorMessageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [errorMessage, setErrorMessage] = useState({
    message: '',
    type: 'hidden'
  });
  return (
    <ErrorMessageContext.Provider value={{ errorMessage, setErrorMessage }}>
      {children}
    </ErrorMessageContext.Provider>
  );
};

export const useErrorMessage = () => {
  const context = useContext(ErrorMessageContext);
  if (!context) {
    throw new Error('useErrorMessage must be used within an ErrorMessageProvider');
  }
  return context;
};
