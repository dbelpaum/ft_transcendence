import React, { ReactNode, createContext, useContext, useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import { useErrorMessage, ErrorMessageProvider } from './ErrorContexte';
import { User } from './AuthInteface';
import { useLocation } from 'react-router-dom';
import { ChannelCreate, ClientToServerEvents, Message, ServerToClientEvents } from '../pages/Chat/chat.interface';
import { io, Socket } from 'socket.io-client';
import { showNotification } from '../pages/Game/Notification';



type AuthContextType = {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    isLoading: boolean;
    logout: () => void;
    login: (token:string) => void;
	authToken: string | null;
	setAuthToken: React.Dispatch<React.SetStateAction<string | null>>;
	chatSocket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
	messages: Message[];
	setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
	recharger: () => void;
	forceReload: number;
  };

type AuthProviderProps = {
  children: ReactNode;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [authToken, setAuthToken] = useState<string | null>(null);
	const [chatSocket, setChatSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
	const [isConnected, setIsConnected] = useState(false);
	const [messages, setMessages] = useState<Message[]>([]);
	const [forceReload, setForceReload] = useState<number>(0);


	const recharger = (): void => {
		setForceReload(prev => prev + 1);
	};

	const useQuery = () => {
		return new URLSearchParams(useLocation().search);
	};
	const query = useQuery();
	const tokenUrl = query.get('token'); 

	// Récupérez votre token JWT
	const token = sessionStorage.getItem('token');


  // Chargez le token JWT depuis sessionStorage lors du démarrage
  useEffect(() => {
	const getUserData = async (authToken:string) => {
	  try {
		setIsLoading(true);
		console.log("token " + authToken);
		const response = await fetch(process.env.REACT_APP_URL_SERVER + 'authentification/42/profil', {
		  credentials: 'include',
		  headers: {
			'Authorization': `Bearer ${authToken}`
		  }
		});
		if (response.ok) {
			const userData = await response.json();
			if (Object.keys(userData).length !== 0) {
			setUser(userData); // Utilisateur connecté
			console.log("the user data");
			} else {
			setUser(null);
			}
		}
		else
		{
			console.log("je passe la")
			setUser(null)
		}
		
	  } catch (error) {
		console.error('Erreur lors de la vérification de l’utilisateur', error);
	  } finally {
		setIsLoading(false);
	  }
	};
  
	const authentificate = async () => {
	  const tokenSession = tokenUrl || sessionStorage.getItem('token');
	  if (tokenSession) {
		  await getUserData(tokenSession);
		await login(tokenSession);
	  }
	  setIsLoading(false);
	};
  
	authentificate();
  }, [authToken]);


  const login = async (token:string) => {
	sessionStorage.removeItem('token');
    sessionStorage.setItem('token', token);
    setAuthToken(token);

	const newChatSocket = io("http://localhost:4000", {
		autoConnect: false,
		auth: { token: token }
		});
	setChatSocket(newChatSocket);
  };



  const logout = () => {
	if (chatSocket)	chatSocket.disconnect()
	sessionStorage.clear()
	setAuthToken(null);
	setUser(null)
};

useEffect(() => {
	if (!user || !chatSocket) return

		chatSocket.connect();

		chatSocket.on('connect', () => {
			setIsConnected(true);
			const updatedUser = { ...user, socketId: chatSocket.id };
			setUser(updatedUser); 
			try{
				const savedChannels: ChannelCreate[] = JSON.parse(sessionStorage.getItem('channels') || '[]');
				const updatedChannels = savedChannels.map(channel => {
					return {
						...channel, 
						user: updatedUser
					};
				});
				if (updatedChannels && updatedUser)
				{
				updatedChannels.forEach((channel) => {
					chatSocket.emit('join_channel', channel);
				});
				}
			}catch (error) {
				console.error('Error parsing JSON from sessionStorage:', error);
				console.error('Data that caused the error:', sessionStorage.getItem('channels'));
				// Gérez l'erreur ou initialisez savedChannels à une valeur par défaut
			  }
			

		});
	
		chatSocket.on('disconnect', () => {
			setIsConnected(false);
		});
	
		chatSocket.on('chat', (e) => {
			setMessages((messages) => [...messages, e]);
		});

		chatSocket.on('notif', (e) => {
			showNotification("Chat", e.message, e.type)
			recharger()
		})
	
		return () => {
			chatSocket.off('connect');
			chatSocket.off('disconnect');
			chatSocket.off('chat');
		};
}, [chatSocket]);



return (
    <AuthContext.Provider value={{ 
		user, 
		setUser, 
		isLoading, 
		login, 
		logout, 
		authToken, 
		setAuthToken, 
		chatSocket, 
		messages, 
		setMessages,
		recharger,
		forceReload
		}}>
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
