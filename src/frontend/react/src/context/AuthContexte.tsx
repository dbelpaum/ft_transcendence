import React, { ReactNode, createContext, useContext, useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import { useErrorMessage, ErrorMessageProvider } from './ErrorContexte';
import { User } from './AuthInteface';




type AuthContextType = {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    isLoading: boolean;
    logout: () => void;
    login: (token:string) => void;
	authToken: string | null;
	setAuthToken: React.Dispatch<React.SetStateAction<string | null>>;
  };

type AuthProviderProps = {
  children: ReactNode;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authToken, setAuthToken] = useState<string | null>(null);

  // Chargez le token JWT depuis sessionStorage lors du démarrage
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      setAuthToken(token);
    }
  }, []);

  const login = (token:string) => {
    sessionStorage.setItem('token', token);
    setAuthToken(token);
  };



  const logout = () => {
    fetch(process.env.REACT_APP_URL_SERVER + 'logout', 
		{ 
			credentials: 'include',
			headers: {
				'Authorization': `Bearer ${authToken}`
	  		}
		})
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
	sessionStorage.removeItem('token');
	setAuthToken(null);
};


  useEffect(() => {
    const verifyUser = async (authToken:string) => {
      try {
        setIsLoading(true);
		console.log("token " + authToken)
        const response = await fetch(process.env.REACT_APP_URL_SERVER + 'authentification/42/profil', 
		{
        	credentials: 'include',
			headers: {
				'Authorization': `Bearer ${authToken}`
	  		}
      	});
        const userData = await response.json();
        if (Object.keys(userData).length != 0) {
			setUser(userData); // Utilisateur connecté
			console.log("the user data")
        }
        else
          setUser(null)
      } catch (error) {
        console.error('Erreur lors de la vérification de l’utilisateur', error);
      } finally {
        setIsLoading(false);
      }
    };
	console.log(authToken)
	if (authToken)
	{
		verifyUser(authToken);
	}
  }, [authToken]);


return (
    <AuthContext.Provider value={{ user, setUser, isLoading, login, logout, authToken, setAuthToken}}>
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
