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
import ChannelInfo from './ChannelInfo';


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
	const [inputValue, setInputValue] = useState<string>('');
	const { user, setUser, chatSocket, messages, setMessages } = useAuth(); 
	
	const [channels, setChannels] = useState<Channel[]>([]);
	const [forceReload, setForceReload] = useState<number>(0);


	const recharger = (): void => {
		setForceReload(prev => prev + 1);
	};


	const channelUtility: ChannelUtility = {
		me: user,
		socket: chatSocket,
		channels: channels,
		setChannels: setChannels,
		message: messages,
		setMessages: setMessages,
		recharger: recharger,
		forceReload: forceReload
	  };

	return (
		<div>
			<h1 className="chat-title">Bienvenue sur le chat {user?.pseudo} !</h1>
			<div className='container'>
				<Channels channelUtility={channelUtility}/>
				<ChannelWrite channelUtility={channelUtility}/>
				<ChannelInfo channelUtility={channelUtility}/>

			</div>
			<div className='chat'>
				<ChatContainer username={user?.pseudo} messages={messages} setMessages={setMessages} socket={chatSocket}/>
			</div>
	  </div>
	  )}




export default Chat;

