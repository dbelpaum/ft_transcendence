import React from 'react';
import {
  ChannelUtility,
	Message,
  } from './chat.interface';

interface MessageProps {
  channelUtility: ChannelUtility;
	message: Message;
	channelUrl: string|null;
}

const MessageComponent: React.FC<MessageProps> = ({ channelUtility, message, channelUrl }) => {

	if (message.channelName !== channelUrl) {
		  return null; // Ne rien afficher si les channels ne correspondent pas
	}

	const isUserMessage = (message.user.id == channelUtility.me?.id)
  


  return (
    !isUserMessage ? 
      (
        <div className='messages'>
          <span>{message.user.login} : {message.message}</span>
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