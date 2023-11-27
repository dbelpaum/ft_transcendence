import React from 'react';

interface MessageProps {
  text: string;
}

const Message: React.FC<MessageProps> = ({ text }) => {
  return (
    <div className='messages'>
      <span>{text}</span>
    </div>
  );
};

export default Message;
