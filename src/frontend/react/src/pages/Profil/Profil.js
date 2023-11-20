import React, { useEffect, useState } from 'react';
import './Profil.css'; // Importation de styles spécifiques à la page d'accueil
import Title from '../../components/Title/Title';
import profil from './profil.png';

function Profil() {
	const [data, setData] = useState(null);

	useEffect(() => {
	// Effectuer la requête HTTP ici
	fetch('http://localhost:4000/sam-test')
		.then(response => response.json())
		.then(data => {
			console.log("je rentre dans le then")
		setData(data); // Mettre à jour l'état avec les données reçues
		})
		.catch(error => {
		console.error('Erreur lors de la requête:', error);
		});
	}, []);
  return (
	<main>
		<Title title="Profil"></Title>
		<section className='image_test'>
			<img src={profil}></img>
		</section>
		<p>{data && <p className='text-white text-center'>Données reçues de Nest: {data.message}</p>}</p>
	</main>
  );
}

export default Profil;
