import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';


function App() {

 // Définir l'état local pour stocker les données
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
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Ceci est un test 1 parce qu'on a pas d'imagination
        </p>
		{data && <p>Données reçues de Nest: {data.message}</p>}
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
