import React from 'react';
import './Game.css'; // Importation de styles spécifiques à la page d'accueil
import Title from '../../components/Title/Title';
import game from './game.png';


function Game() {
  return (
	<main>
		<Title title="Jeux"></Title>
		<section className='image_test'>
			<img src={game}></img>
		</section>
	</main>
  );
}

export default Game;
