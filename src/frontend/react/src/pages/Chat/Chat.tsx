import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import './Chat.css'; // Importation de styles spécifiques à la page d'accueil
import Title from '../../components/Title/Title';
// import chat from './chat.png';
import ChatContainer from './ChatContainer';
import {
	User,
	Message,
	ServerToClientEvents,
	ClientToServerEvents,
  } from './chat.interface';
import { useAuth } from '../../context/AuthContexte'; 

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io("http://localhost:4000");

// function Chat() {
// 	//const [isConnected, setIsConnected] = useState(Socket.connected);
// 	const [messages, setMessages] = useState<Message[]>([]);
// 	const [isConnected, setIsConnected] = useState(socket.connected);
// 	const { user, setUser } = useAuth(); 

// 	useEffect(() => {
	
// 		socket.on('connect', () => {
// 		  setIsConnected(true);
// 		});
	
// 		socket.on('disconnect', () => {
// 		  setIsConnected(false);
// 		});
	
// 		socket.on('chat', (e) => {
// 		  setMessages((messages) => [e, ...messages]);
// 		  console.log("quel chose a été recu")
// 		  console.log(e)
// 		});
	
// 		return () => {
// 		  socket.off('connect');
// 		  socket.off('disconnect');
// 		  socket.off('chat');
// 		};
// 	  }, []);

// 	  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
// 		console.log(e)
// 		// 	const message = e.target[0].text as string
// 		//   console.log("message envoye dans send message : " + message)
// 		// if (user && message) {
// 		//   const result = socket.emit('chat', {
// 		// 	user: {
// 		// 	  id: user.id,
// 		// 	  login: user.login,
// 		// 	},
// 		// 	timeSent: new Date(Date.now()).toLocaleString('en-US'),
// 		// 	message: e.target[0].value as string,
// 		//   });
// 		//   console.log(result)
// 		// }
// 	  };
	

// 	return (
// 		<main>
// 			<p className="test">nom :{user && user.login}</p>
// 			<div className='container'>
// 				<div className='channels'>
// 					<h1>Channels</h1>

// 				</div>
// 				<div className='chat'>
// 					<ChatContainer username={user && user.login} messages={messages} sendMessages={sendMessage} />
// 				</div>
// 			</div>
// 		</main>
// 	);
// }

// export default Chat;

















































function Chat(){
	const [messages, setMessages] = useState<Message[]>([]);
	const [inputValue, setInputValue] = useState<string>('');
	const { user, setUser } = useAuth(); 
	const [isConnected, setIsConnected] = useState(socket.connected);



	
	useEffect(() => {
	
		socket.on('connect', () => {
		setIsConnected(true);
		});
	
		socket.on('disconnect', () => {
		setIsConnected(false);
		});
	
		socket.on('chat', (e) => {
			setMessages((messages) => [e, ...messages]);
			console.log("quel chose a été recu")
			console.log(e)
		});
	
		return () => {
			socket.off('connect');
			socket.off('disconnect');
			socket.off('chat');
		};
	}, []);

	return (
		<div>
			<h1 className="chat-title">Bienvenue sur le chat {user?.login} !</h1>
			<div className='container'>
				<div className='channels'>
					<h1> Channels</h1>
					<h4>On verra apres</h4>
				</div>
			</div>
			<div className='chat'>
				<ChatContainer username={user?.login} messages={messages} setMessages={setMessages} socket={socket}/>
			</div>
	  </div>
	  )}




export default Chat;


{/* <main>
<Title title="Chat" />
<div className='container'>
  <div className="channels">
	  <h1>Channels</h1>
	  <h4>Channels</h4>
	  <div className="message-list">
		  {messages.map((message) => (
			  <div key={message.id} className="message">
			  {message.user.login + ": " + message.message}
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
</main> */}