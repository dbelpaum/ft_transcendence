import React from 'react';
import './Chat.css'; // Importation de styles spécifiques à la page d'accueil
import Title from '../../components/Title/Title';
import chat from './chat.png';


function Chat() {
  return (
	<main>
		<Title title="Chat"></Title>
		<section className='image_test'>
			<img src={chat}></img>
		</section>
	</main>
  );
}

export default Chat;
