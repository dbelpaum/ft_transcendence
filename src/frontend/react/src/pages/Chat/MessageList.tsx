import React from 'react';
import Message from './Message';

interface MessageListProps {
  username: string;
  messages: { text: string }[]; // Définir le type de la prop messages
}

const MessageList: React.FC<MessageListProps> = ({ username, messages }) => {
  return (
    <div className='chat-box'>
      {messages.map((message, index) => (
        <Message username={username} key={index} text={message.text} />
      ))}
    </div>
  );
};

export default MessageList;
