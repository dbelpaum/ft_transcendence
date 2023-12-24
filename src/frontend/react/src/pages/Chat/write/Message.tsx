import React from 'react';
import {
  ChannelUtility,
	Message,
  } from '../chat.interface';

interface MessageProps {
  channelUtility: ChannelUtility;
	message: Message;
	channelUrl: string|null;
	mpUrl: string|null
}

const MessageComponent: React.FC<MessageProps> = ({ channelUtility, message, channelUrl, mpUrl }) => {

	if (message.channelName !== channelUrl && message.channelName !== mpUrl) {
		  return null; // Ne rien afficher si les channels ne correspondent pas
	}

	const isUserMessage = (message.user.id == channelUtility.me?.id)
  


  return (
    !isUserMessage ? 
      (
        <div className='messages'>
          <span><a href={`http://localhost:3000/users/${message.user.pseudo}`} target="_blank" rel="noopener noreferrer">{message.user.pseudo}</a> : {message.message}</span>
        </div>
      ) 
      : 
      (
        <div className='messages right'>
          <span>{message.message}</span>
        </div>
      )
  );
};

export default MessageComponent;