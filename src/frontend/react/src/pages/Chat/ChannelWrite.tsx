import React, { useState, useEffect } from 'react';
import {
	ChannelUtility
  } from './chat.interface';
import { useLocation } from 'react-router-dom';
import MessageComponent from './Message';
import { ChannelCreate } from './chat.interface';
import { Channel } from './chat.interface';
import MessageInput from './MessageInput';

interface ChannelWriteProps {
	channelUtility: ChannelUtility;
  }
  
const ChannelWrite: React.FC<ChannelWriteProps> = ({ channelUtility }) => {

	const [password, setPassword] = useState('');

	const useQuery = () => {
		return new URLSearchParams(useLocation().search);
	};
	const query = useQuery();
	const channelUrl = query.get('channel'); 

	

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

		if (channelUrl && channelUtility.me && channelInfo)
		{

			const channelJoin : ChannelCreate = {
				name: channelUrl,
				user: channelUtility.me,
				type: channelInfo.type,
				mdp: password,
			}
			channelUtility.socket.emit("join_channel", channelJoin);
			const savedChannels: ChannelCreate[] = JSON.parse(sessionStorage.getItem('channels') || '[]');
			const newChannels: ChannelCreate[]  = [...savedChannels, channelJoin];
			sessionStorage.setItem('channels', JSON.stringify(newChannels));
			channelUtility.recharger()
			};
		}
		
	if (!channelUrl)
	{
		return (
			<div className="write-chat no-channel">
				<p>Creez ou rejoignez un channel de discussion</p>
			</div>
		)
	}

	return (
		<div className='write-chat'>
			<h2>{channelUrl}</h2>
			<div className='chat-box'>
			{isUserInChannel ? (
				channelUtility.message.map((message, index) => (
					<MessageComponent channelUtility={channelUtility} message={message} key={index} channelUrl={channelUrl} />
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