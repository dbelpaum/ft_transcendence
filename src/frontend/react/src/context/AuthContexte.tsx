import React, { ReactNode, createContext, useContext, useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import { useErrorMessage, ErrorMessageProvider } from './ErrorContexte';

export interface User {
    id: number;
    login: string;
    email: string;
    imageUrl: string;
    firstname: string;
    lastname: string;
}



type AuthContextType = {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    isLoading: boolean;
    logout: () => void;
  };

type AuthProviderProps = {
  children: ReactNode;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
  const { setErrorMessage } = useErrorMessage();
  const [isLoading, setIsLoading] = useState<boolean>(true);


  const logout = () => {
    fetch(process.env.REACT_APP_URL_SERVER + 'logout', { credentials: 'include' })
        .then(response => {
            if (response.ok) {
              sessionStorage.clear();
              setUser(null);
              
            } else {
                console.error('Erreur lors de la déconnexion');
            }
        })
        .catch(error => {
            console.error('Erreur de réseau lors de la tentative de déconnexion', error);
        });
};


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
    <AuthContext.Provider value={{ user, setUser, isLoading , logout}}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook that provides access to the authentication context.
 * Throws an error if used outside of an AuthProvider.
 * @returns The authentication context.
 * @throws Error if used outside of an AuthProvider.
 */
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error('useAuth doit être utilisé au sein d’un AuthProvider');
    }
    return context;
};
