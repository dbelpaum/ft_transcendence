import React from 'react';
import Message from './Message';

interface MessageListProps {
  messages: { text: string }[]; // Définir le type de la prop messages
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <div className='chat-box'>
      {messages.map((message, index) => (
        <Message key={index} text={message.text} />
      ))}
    </div>
  );
};

export default MessageList;
