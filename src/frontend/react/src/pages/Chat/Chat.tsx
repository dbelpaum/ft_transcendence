import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import './Chat.css'; // Importation de styles spécifiques à la page d'accueil
import Title from '../../components/Title/Title';
// import chat from './chat.png';
import ChatContainer from './ChatContainer';
import Channels from './Channels';
import {
	User,
	Message,
	ServerToClientEvents,
	ClientToServerEvents,
	Room,
	ChannelUtility
  } from './chat.interface';
import { useAuth } from '../../context/AuthContexte'; 

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io("http://localhost:4000");



function Chat(){
	const [messages, setMessages] = useState<Message[]>([]);
	const [inputValue, setInputValue] = useState<string>('');
	const { user, setUser } = useAuth(); 
	const [isConnected, setIsConnected] = useState(socket.connected);
	
	const [rooms, setRooms] = useState<Room[]>([]);

	
	useEffect(() => {
	
		socket.on('connect', () => {
		setIsConnected(true);
		});
	
		socket.on('disconnect', () => {
		setIsConnected(false);
		});
	
		socket.on('chat', (e) => {
			setMessages((messages) => [e, ...messages]);
			console.log("quel chose a été recu")
			console.log(e)
		});
	
		return () => {
			socket.off('connect');
			socket.off('disconnect');
			socket.off('chat');
		};
	}, []);

	const channelUtility: ChannelUtility = {
		me: user,
		socket: socket,
		rooms: rooms,
	  };

	return (
		<div>
			<h1 className="chat-title">Bienvenue sur le chat {user?.login} !</h1>
			<div className='container'>
				<div className='channels'>
					<h1> Channels</h1>
					<Channels channelUtility={channelUtility}/>
				</div>
			</div>
			<div className='chat'>
				<ChatContainer username={user?.login} messages={messages} setMessages={setMessages} socket={socket}/>
			</div>
	  </div>
	  )}




export default Chat;

