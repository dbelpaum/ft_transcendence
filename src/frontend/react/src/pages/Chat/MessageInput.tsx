import React, { useState, ChangeEvent, FormEvent, Dispatch, SetStateAction } from 'react';
import {
	User,
	Message,
	ServerToClientEvents,
	ClientToServerEvents,
  } from './chat.interface';
import { useAuth } from '../../context/AuthContexte'; 
import { v4 as uuidv4 } from 'uuid';
import { Socket } from 'socket.io-client';

interface MessageInputProps {
  setMessages: Dispatch<SetStateAction<Message[]>>;
  messages: Message[];
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;
}

const MessageInput: React.FC<MessageInputProps> = ({ setMessages, messages, socket }) => {
  const [inputValue, setInputValue] = useState('');
  const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false);
  const [showChat, setShowChat] = useState<boolean>(false);
  const { user, setUser } = useAuth(); 

  const handleMessageSubmit = (e: React.FormEvent) => {
	e.preventDefault();
	if (inputValue.trim() !== '') {
	  // Si l'input n'est pas vide, on affiche le chat et ajoute le message
	  setShowChat(true);
	  setShowErrorMessage(false); // Cache le message d'erreur s'il était affiché
	  const newMessage: Message = {
		message: inputValue.trim(),
		user: user as User,
		id: uuidv4(),
		timeSent: new Date(Date.now()).toLocaleString('en-US')
	};
	setInputValue(''); // Efface l'input après l'envoi du message
	if (user && newMessage) {
		const result = socket.emit('chat', newMessage);
	}
	else {
	  // Si l'input est vide, on affiche un message d'erreur
	  setShowErrorMessage(true);
	}
}
};

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className='input-box'>

    <form onSubmit={handleMessageSubmit}>
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