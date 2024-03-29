import React, { ReactNode, createContext, useContext, useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import { useErrorMessage, ErrorMessageProvider } from './ErrorContexte';
import { Info2FA, User } from './AuthInteface';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChannelCreate, ClientToServerEvents, Message, MpChannel, ServerToClientEvents } from '../pages/Chat/chat.interface';
import { io, Socket } from 'socket.io-client';
import { showNotification, showNotificationError } from '../pages/Game/Notification';
import ModalCode2FA from '../components/2FA/ModalCode2FA';


type AuthContextType = {
	user: User | null;
	setUser: React.Dispatch<React.SetStateAction<User | null>>;
	isLoading: boolean;
	logout: () => void;
	login: (token: string) => void;
	authToken: string | null;
	setAuthToken: React.Dispatch<React.SetStateAction<string | null>>;
	chatSocket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
	messages: Message[];
	setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
	recharger: () => void;
	forceReload: number;
	info2FA: Info2FA | null,
	setInfo2FA: React.Dispatch<React.SetStateAction<Info2FA | null>>
	socket: any,
	setSocket: React.Dispatch<React.SetStateAction<any>>,
	inLobby: boolean
	setInLobby: React.Dispatch<React.SetStateAction<boolean>>
	lobbyData: any
	setLobbyData: any
	gameStarted: boolean
	setGameStarted: React.Dispatch<React.SetStateAction<boolean>>
	showScoreRanking: any
	setShowScoreRanking: any
	isReady: boolean
	setIsReady: React.Dispatch<React.SetStateAction<boolean>>
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
	const [info2FA, setInfo2FA] = useState<Info2FA | null>(null);
	const [socket, setSocket] = useState<any>(null);


	const [inLobby, setInLobby] = useState<boolean>(false);
	const [lobbyData, setLobbyData] = useState<any>(null);
	const [gameStarted, setGameStarted] = useState<boolean>(false);
	const [showScoreRanking, setShowScoreRanking] = useState<boolean>(false); // Ajout d'un état pour afficher ou masquer la superposition du classement
	const [isReady, setIsReady] = useState<boolean>(false);

	const navigate = useNavigate();

	const recharger = (): void => {
		setForceReload(prev => prev + 1);
	};

	const useQuery = () => {
		return new URLSearchParams(useLocation().search);
	};
	const query = useQuery();
	const tokenUrl = query.get('token');
	const error = query.get('error');

	// Récupérez votre token JWT
	const token = localStorage.getItem('token');


	// Chargez le token JWT depuis localStorage lors du démarrage
	useEffect(() => {
		if (error === "errorAuthentification") {
			showNotificationError("Athentification error", "Erreur lors de la requete a l'api 42. Recommencez, ça devrait marcher")
		}
		const getUserData = async (authToken: string) => {
			try {
				setIsLoading(true);
				const response = await fetch('http://localhost:4000/authentification/42/profil', {
					credentials: 'include',
					headers: {
						'Authorization': `Bearer ${authToken}`
					}
				});
				if (!response.ok) throw new Error('Réponse non OK du serveur');
				const userData = await response.json();
				// console.log("userdata")
				// console.log(userData)
				if ('need2fa' in userData) {
					setInfo2FA(userData as Info2FA)
				}
				else if (Object.keys(userData).length !== 0) {
					setUser(userData); // Utilisateur connecté
				}
				else {
					setUser(null);
				}

			} catch (error) {
				setUser(null)
			} finally {
				setIsLoading(false);
			}
		};

		const authentificate = async () => {
			if (user) return
			if (authToken) return
			const tokenSession = tokenUrl || localStorage.getItem('token');
			if (tokenSession) {
				await getUserData(tokenSession);
				await login(tokenSession);
			}
			setIsLoading(false);
		};

		authentificate();
		if (tokenUrl)
		{
			navigate('/profil');
		}
	}, []);


	const login = async (token: string) => {
		localStorage.removeItem('token');
		localStorage.setItem('token', token);
		setAuthToken(token);
		const newChatSocket = io("http://localhost:4000", {
			autoConnect: false,
			auth: { token: token }
		});
		const socket = io("http://localhost:4000/game",
			{
				auth: {
					token: token
				}
			});
		setChatSocket(newChatSocket);
		setSocket(socket)
	};



	const logout = () => {
		if (chatSocket) chatSocket.disconnect()
		if (socket) socket.disconnect()
		localStorage.clear()
		setAuthToken(null);
		setUser(null)
	};

	useEffect(() => {
		if (!user || !chatSocket) return
		chatSocket.connect();
		socket.connect();
		chatSocket.on('connect', () => {

			setIsConnected(true);
			const updatedUser = { ...user, socketId: chatSocket.id };
			setUser(updatedUser);
			try {
				const savedChannels: ChannelCreate[] = JSON.parse(localStorage.getItem('channels') || '[]');
				const updatedChannels = savedChannels.map(channel => {
					return {
						...channel,
						user: updatedUser
					};
				});
				if (updatedChannels && updatedUser) {
					updatedChannels.forEach((channel) => {
						chatSocket.emit('join_channel', channel);
					});
				}
			} catch (error) {
				console.error('Error parsing JSON from localStorage:', error);
				console.error('Data that caused the error:', localStorage.getItem('channels'));
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
			if (e.message != "Nouveau channel créé")
			{
				showNotification("Chat", e.message, e.type)

			}
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
			forceReload,
			info2FA,
			setInfo2FA,
			socket,
			setSocket,
			inLobby,
			setInLobby,
			lobbyData,
			setLobbyData,
			gameStarted,
			setGameStarted,
			showScoreRanking,
			setShowScoreRanking,
			isReady,
			setIsReady,
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
