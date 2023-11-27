import React, { useState } from 'react';import './Chat.css'; // Importation de styles spécifiques à la page d'accueil
import Title from '../../components/Title/Title';
import chat from './chat.png';

interface Message {
	username: string | null; // Champ username dans l'interface Message
	id: number;
	text: string;
  }
  


function Chat(){
	const [showChat, setShowChat] = useState<boolean>(false);
	const [messages, setMessages] = useState<Message[]>([]);
	const [inputValue, setInputValue] = useState<string>('');
	const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false);
	const [username, setUsername] = useState<string | null>(null); // État pour stocker le nom d'utilisateur

	const handleMessageSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (inputValue.trim() !== '') {
		  // Si l'input n'est pas vide, on affiche le chat et ajoute le message
		  setShowChat(true);
		  setShowErrorMessage(false); // Cache le message d'erreur s'il était affiché
		  const newMessage: Message = {
			id: messages.length + 1,
			text: inputValue.trim(),
			username: username, // Utilisation du nom d'utilisateur saisi
		  };
		  setMessages([...messages, newMessage]); // Ajoute le nouveau message à la liste
		  setInputValue(''); // Efface l'input après l'envoi du message
		} else {
		  // Si l'input est vide, on affiche un message d'erreur
		  setShowErrorMessage(true);
		}
	  };
	
	  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setUsername(e.target.value); // Mettre à jour le nom d'utilisateur lorsque l'utilisateur tape
	  };

	return (
		<main>
		  <Title title="Chat" />
		  <div className="centered">
			{!showChat ? (
			  <div>
				{showErrorMessage && <p>Please enter a username</p>}
				<input
            type="text"
            value={username || ''}
            onChange={handleUsernameChange}
            placeholder="Enter your username"
          />
				<button onClick={() => 
				{
					if (username == null)
					{
						alert('Put a name');
					}
					else
					{
						setShowChat(true);
					}
				}}>Enter the chat</button>
			  </div>
			) : (
			  <div>
				<div className="chat-container">
				<div className="message-list">
				{messages.map((message) => (
					<div key={message.id} className="message">
					{message.username + ": " + message.text}
					</div>
				))}
				</div>
				<form onSubmit={handleMessageSubmit}>
				<input
					type="text"
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					placeholder="Type a message..."
				/>
				<button type="submit">Send</button>
				</form>
			</div>
			  </div>
			)}
		  </div>
		</main>
	  );

}



export default Chat;
