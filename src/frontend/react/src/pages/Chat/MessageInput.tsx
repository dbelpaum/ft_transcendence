import React, { useState, ChangeEvent, FormEvent, Dispatch, SetStateAction } from 'react';
import {
	Message,
	ServerToClientEvents,
	ClientToServerEvents,
  } from './chat.interface';
import { User } from '../../context/AuthInteface';
import { useAuth } from '../../context/AuthContexte'; 
import { v4 as uuidv4 } from 'uuid';
import { Socket } from 'socket.io-client';
import { useLocation } from 'react-router-dom';


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

  const useQuery = () => {
	return new URLSearchParams(useLocation().search);
};
	const channelUrl = useQuery().get('channel'); 

  const handleMessageSubmit = (e: React.FormEvent) => {
	e.preventDefault();
	if (inputValue.trim() !== '' && channelUrl) {
	  // Si l'input n'est pas vide, on affiche le chat et ajoute le message
	  setShowChat(true);
	  setShowErrorMessage(false); // Cache le message d'erreur s'il était affiché
	  const newMessage: Message = {
		message: inputValue.trim(),
		user: user as User,
		id: uuidv4(),
		timeSent: new Date(Date.now()).toLocaleString('en-US'),
		channelName: channelUrl
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

		<form onSubmit={handleMessageSubmit} className="input-chat-form">
			<input
				type="text"
				value={inputValue}
				onChange={handleInputChange}
				placeholder="Type your message..."
				/>
		<button type="submit">Envoyer</button>
		</form>
     </div>
  );
};

export default MessageInput;