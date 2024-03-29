import React, { useState, useEffect, useRef } from 'react';
import {
	ChannelUtility
  } from '../chat.interface';
import { useLocation } from 'react-router-dom';
import MessageComponent from './Message';
import { ChannelCreate } from '../chat.interface';
import { Channel } from '../chat.interface';
import MessageInput from './MessageInput';
import { useAuth } from '../../../context/AuthContexte';

interface ChannelWriteProps {
	channelUtility: ChannelUtility;
  }
  
const ChannelWrite: React.FC<ChannelWriteProps> = ({ channelUtility }) => {

	const [password, setPassword] = useState('');
	const bottomRef = useRef<HTMLDivElement>(null);
	const [blockedUserIds, setBlockedUserIds] = useState<number[]>([]);
	const {authToken} = useAuth() 

	const useQuery = () => {
		return new URLSearchParams(useLocation().search);
	};
	const query = useQuery();
	const channelUrl = query.get('channel'); 
	const mpUrl = query.get('mp'); 

	useEffect(() => {
		const fetchBlockedUsers = async () => {
		  try {
			const response = await fetch('http://localhost:4000/friendship/blocklist',
			{
				credentials: 'include',
				headers: {
				  'Authorization': `Bearer ${authToken}`
				}
			});
			const data = await response.json() as number[];
			setBlockedUserIds(data);
		  } catch (error) {
			console.error('Erreur lors de la récupération des utilisateurs bloqués:', error);
		  }
		};
	
		fetchBlockedUsers();
	  }, []);

	useEffect(() => {
		const handleScrollToBottom = () => {
			setTimeout(() => {
				if (bottomRef && bottomRef.current)
				{
					bottomRef.current.scrollTop = bottomRef.current.scrollHeight;
					//bottomRef.current.scrollIntoView({ behavior: 'smooth' });
				}
			  }, 1000);
		};

	  
		// Ajouter l'écouteur d'événements
		window.addEventListener('scrollToBottom', handleScrollToBottom);
	  
		// Nettoyage
		return () => {
		  window.removeEventListener('scrollToBottom', handleScrollToBottom);
		};
	  }, []);

	// Fonction pour vérifier si l'utilisateur est dans le channel
	const isUserInChannel = channelUtility.channels.some(channel => 
		channel.name === channelUrl && channel.users.some(user => user.socketId === channelUtility.me?.socketId));

	const channelIsProtected = channelUtility.channels.some(channel => 
			channel.name === channelUrl && channel.type === 'protected');

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value);
		};
	
	var channelInfo : Channel|undefined = channelUtility.channels.find(c => c.name === channelUrl);
	
	const handleJoinChannel = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		channelInfo = channelUtility.channels.find(c => c.name === channelUrl);

		if (channelUrl && channelUtility.me && channelInfo && channelUtility.socket)
		{

			const channelJoin : ChannelCreate = {
				name: channelUrl,
				user: channelUtility.me,
				type: channelInfo.type,
				mdp: password,
			}
			channelUtility.socket.emit("join_channel", channelJoin);
			try{
				const savedChannels: ChannelCreate[] = JSON.parse(localStorage.getItem('channels') || '[]');
				const newChannels: ChannelCreate[]  = [...savedChannels, channelJoin];
				localStorage.setItem('channels', JSON.stringify(newChannels));
				channelUtility.recharger()
			}catch (error) {
				console.error('Error parsing JSON from localStorage:', error);
				console.error('Data that caused the error:', localStorage.getItem('channels'));
				// Gérez l'erreur ou initialisez savedChannels à une valeur par défaut
			}

			};
		}
		
	if (!channelUrl && !mpUrl)
	{
		return (
			<div className="write-chat no-channel">
				<p>Creez ou rejoignez un channel de discussion</p>
			</div>
		)
	}


	  

	return (
		<div className='write-chat' ref={bottomRef}>
			<h2>{channelUrl}</h2>
			<div className='chat-box'>
			{(isUserInChannel || mpUrl) ? (
				channelUtility.message.map((message, index) => (
					<MessageComponent channelUtility={channelUtility} message={message} key={index} channelUrl={channelUrl} mpUrl={mpUrl} blockedUserIds={blockedUserIds}/>
				))
				) : (
					<form onSubmit={handleJoinChannel} className="join-channel-form">
					{channelIsProtected && (
					  <input
						type="password"
						placeholder="Mot de passe du channel"
						value={password}
						onChange={handlePasswordChange}
					  />
					)}
					<button type="submit" className="join-channel-button">Rejoindre le Channel</button>
				  </form>
				)}
				</div>
		</div>
	)
};

export default ChannelWrite;