import React, { useState, useEffect } from 'react';
import {
	ChannelUtility
  } from './chat.interface';
import { useLocation } from 'react-router-dom';
import MessageComponent from './Message';
  


interface ChannelWriteProps {
	channelUtility: ChannelUtility;
  }
  
const ChannelWrite: React.FC<ChannelWriteProps> = ({ channelUtility }) => {
	const useQuery = () => {
		return new URLSearchParams(useLocation().search);
	};
	const query = useQuery();
	const channelUrl = query.get('channel'); 


	return (
		<div className='write-chat'>
			<h2>{channelUrl}</h2>
			<div className='chat-box'>
				{channelUtility.message.map((message, index) => (
					<MessageComponent message={message} key={index} channelUrl={channelUrl}/>
				))}
				</div>
		</div>
	)
};

export default ChannelWrite;