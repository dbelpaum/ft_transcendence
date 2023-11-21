import React from 'react';
import './Home.css'; // Importation de styles spécifiques à la page d'accueil
import Title from '../../components/Title/Title';
import accueil from './accueil.png';


function Home() {
  return (
	<main>
		<Title title="Connexion"></Title>
		<section className='image_test'>
			<img src={accueil}></img>
		</section>
	</main>
  );
}

export default Home;
