import React, { ReactNode, createContext, useContext, useState, useEffect } from 'react';
import { useErrorMessage, ErrorMessageProvider } from './ErrorContexte';

export interface User {
    id: number;
    login: string;
    email: string;
}



type AuthContextType = {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    isLoading: boolean;
  };

type AuthProviderProps = {
  children: ReactNode;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);

  const { setErrorMessage } = useErrorMessage();

  useEffect(() => {
      if (user) {
        setErrorMessage({
        message: `Bravo, vous etes connecté ${user.login}`,
        type: 'success'
        });
      }
      }, [user, setErrorMessage]);



  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(process.env.REACT_APP_URL_SERVER + 'authentification/42/profil', {
        credentials: 'include'
      });
        const userData = await response.json();
        if (Object.keys(userData).length != 0) {
          setUser(userData); // Utilisateur connecté
        }
        else
          setUser(null)
      } catch (error) {
        console.error('Erreur lors de la vérification de l’utilisateur', error);
      } finally {
        setIsLoading(false);
      }
    };

    verifyUser();
  }, []);


return (
    <AuthContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error('useAuth doit être utilisé au sein d’un AuthProvider');
    }
    return context;
  };