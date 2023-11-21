import React from 'react';
import './Title.css'; // Importation de styles spécifiques à la page d'accueil
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';


function Title({title}) {
  return (
      <section className="title">
        <Link to="/"><h1>Transcendance</h1></Link>
        <h2>{title}</h2>
      </section>
  );
}

export default Title;
