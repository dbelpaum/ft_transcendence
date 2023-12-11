import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import './Chat.css'; // Importation de styles spécifiques à la page d'accueil
import Title from '../../components/Title/Title';
// import chat from './chat.png';
import ChatContainer from './ChatContainer';
import Channels from './Channels';
import {
	Message,
	ServerToClientEvents,
	ClientToServerEvents,
	Channel,
	ChannelUtility,
	ChannelCreate
  } from './chat.interface';
  import { User } from '../../context/AuthInteface';
import { useAuth } from '../../context/AuthContexte'; 
import ChannelWrite from './ChannelWrite';


const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io("http://localhost:4000", { autoConnect: false });


/*
  Ce que je veux d'abord c'est que lorsque j'ajoute un channel
  Le channel apparaisse
  Du coup il faut un truc qui fetch l'api au point voulu
  et qui set la liste de channels en consequenses
  ce truc sera dans un useEffects
  et ce serais cool qu'on s'arrange pour qu'il se mette a jour toues les 60 secondes
  ou quand channels est mis a jour avec set channels justement !
*/

function Chat(){
	const [messages, setMessages] = useState<Message[]>([]);
	const [inputValue, setInputValue] = useState<string>('');
	const { user, setUser } = useAuth(); 
	const [isConnected, setIsConnected] = useState(socket.connected);
	
	const [channels, setChannels] = useState<Channel[]>([]);

	
	useEffect(() => {
	
		if (user)
		{
			socket.connect();

			socket.on('connect', () => {
				setIsConnected(true);
				const updatedUser = { ...user, socketId: socket.id };
				setUser(updatedUser); 
				const savedChannels: {name: string}[] = JSON.parse(sessionStorage.getItem('channels') || '[]');
				if (savedChannels && updatedUser)
				{
					savedChannels.forEach((channel) => {
						const channelJoin : ChannelCreate = {
							name: channel.name,
							user: updatedUser
						}
						socket.emit('join_channel', channelJoin);
					});
				}

			});
		
		}
			socket.on('disconnect', () => {
				setIsConnected(false);
			});
		
			socket.on('chat', (e) => {
				setMessages((messages) => [e, ...messages]);
				console.log(messages)
				
			});
		
			return () => {
				socket.off('connect');
				socket.off('disconnect');
				socket.off('chat');
			};
	}, [user]);

	const channelUtility: ChannelUtility = {
		me: user,
		socket: socket,
		channels: channels,
		setChannels: setChannels,
		message: messages,
	  };

	return (
		<div>
			<h1 className="chat-title">Bienvenue sur le chat {user?.login} !</h1>
			<div className='container'>
				<Channels channelUtility={channelUtility}/>
				<ChannelWrite channelUtility={channelUtility}/>
			</div>
			<div className='chat'>
				<ChatContainer username={user?.login} messages={messages} setMessages={setMessages} socket={socket}/>
			</div>
	  </div>
	  )}




export default Chat;

