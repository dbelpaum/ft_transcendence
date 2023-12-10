import React from 'react';
import MessageComponent from './Message';
import {
	Message,
  } from './chat.interface';

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <div className='chat-box'>
      {messages.map((message, index) => (
        <MessageComponent message={message} key={index} />
      ))}
    </div>
  );
};

export default MessageList;