import React, { useEffect, useState } from 'react';
import './Profil.css'; // Importation de styles spécifiques à la page d'accueil
import Title from '../../components/Title/Title';
import profil from './profil.png';

interface Data {
    message: string; // Adjust the structure according to your API response
}

function Profil() {
    const [data, setData] = useState<Data | null>(null); // Specify the type here

    useEffect(() => {
        // Effectuer la requête HTTP ici
        fetch('http://localhost:4000/sam-test')
            .then(response => response.json())
            .then(data => {
                console.log("je rentre dans le then");
                setData(data); // Mettre à jour l'état avec les données reçues
            })
            .catch(error => {
                console.error('Erreur lors de la requête:', error);
            });
    }, []);

    return (
        <main>
            <Title title="Profil" />
            <section className='image_test'>
                <img src={profil} alt="Profile" />
            </section>
            <p>{data && <p className='text-white text-center'>Données reçues de Nest: {data.message}</p>}</p>
        </main>
    );
}

export default Profil;
