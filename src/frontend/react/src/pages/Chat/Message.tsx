import React from 'react';
import {
	Message,
  } from './chat.interface';

interface MessageProps {
	message: Message;
}

const MessageComponent: React.FC<MessageProps> = ({ message }) => {
  return (
    <div className='messages'>
      <span>{message.user.login} : {message.message}</span>
    </div>
  );
};

export default MessageComponent;