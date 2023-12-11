import React from 'react';
import {
	Message,
  } from './chat.interface';

interface MessageProps {
	message: Message;
	channelUrl: string|null;
}

const MessageComponent: React.FC<MessageProps> = ({ message, channelUrl }) => {

	if (message.channelName !== channelUrl) {
		return null; // Ne rien afficher si les channels ne correspondent pas
	  }
  return (
    <div className='messages'>
      <span>{message.user.login} : {message.message}</span>
    </div>
  );
};

export default MessageComponent;