import React from 'react';

interface MessageProps {
  username: string;
  text: string;
}

const Message: React.FC<MessageProps> = ({ username, text }) => {
  return (
    <div className='messages'>
      <span>{username}: {text}</span>
    </div>
  );
};

export default Message;
