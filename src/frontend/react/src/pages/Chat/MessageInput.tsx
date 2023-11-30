import React, { useState, ChangeEvent, FormEvent, Dispatch, SetStateAction } from 'react';

interface Message {
  text: string;
}

interface MessageInputProps {
  setMessages: Dispatch<SetStateAction<Message[]>>;
}

const MessageInput: React.FC<MessageInputProps> = ({ setMessages }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue.trim() !== '') {
      setMessages((prevMessages: Message[]) => [...prevMessages, { text: inputValue }]);
      setInputValue('');
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className='input-box'>

    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Type your message..."
        />
      <button type="submit">Send</button>
    </form>
        </div>
  );
};

export default MessageInput;
