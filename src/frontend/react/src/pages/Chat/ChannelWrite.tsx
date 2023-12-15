import React, { useState, useEffect } from 'react';
import {
	ChannelUtility
  } from './chat.interface';
import { useLocation } from 'react-router-dom';
import MessageComponent from './Message';
import { ChannelCreate } from './chat.interface';


interface ChannelWriteProps {
	channelUtility: ChannelUtility;
  }
  
const ChannelWrite: React.FC<ChannelWriteProps> = ({ channelUtility }) => {
	const useQuery = () => {
		return new URLSearchParams(useLocation().search);
	};
	const query = useQuery();
	const channelUrl = query.get('channel'); 

	// Fonction pour vérifier si l'utilisateur est dans le channel
	const isUserInChannel = channelUtility.channels.some(channel => 
		channel.name === channelUrl && channel.users.some(user => user.socketId === channelUtility.me?.socketId));

	const handleJoinChannel = () => {
		if (channelUrl && channelUtility.me)
		{
			const channelJoin : ChannelCreate = {
				name: channelUrl,
				user: channelUtility.me,
				type: "public",
				mdp: "",
			}
			channelUtility.socket.emit('join_channel', channelJoin);

			const savedChannels: {name: string}[] = JSON.parse(sessionStorage.getItem('channels') || '[]');
			const newChannels: {name: string}[]  = [...savedChannels, { name: channelUrl }];
			sessionStorage.setItem('channels', JSON.stringify(newChannels));
			window.location.reload();

			};
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
				<button onClick={handleJoinChannel} className="join-channel-button">Rejoindre le Channel</button>
				)}
				</div>
		</div>
	)
};

export default ChannelWrite;