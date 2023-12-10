import React from 'react';
import './Home.css'; // Importation de styles spécifiques à la page d'accueil
import Title from '../../components/Title/Title';
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import accueil from './accueil.png';
import logo from './logo_pong.png'
import ButtonNav from '../../components/ButtonNav/ButtonNav';
import test from '../Chat/Chat'
import ErrorModule from '../../components/ErrorMessages/ErrorModule';


interface HomeProps {}

function Home(props: HomeProps) {
    return (
        <main>
            <ErrorModule />
            {/* <Title></Title> */}
            <section className="image_test">
                <img src={logo} alt="Logo" />
            </section>
            <div className="button_auth">
                <ButtonNav text="Login with 42" color="DarkTurquoise" path="http://localhost:4000/authentification/42" />
            {/* <a href="https://localhost:4000/authentification/42" target="_blank" rel="noopener noreferrer">{"auth42"}</a> */}
                {/* <br/>
                <ButtonNav text="Login with Google" color="IndianRed" />
                <br/>
                <ButtonNav text="Sign in" color="purple" /> */}
            </div>
        </main>
    );
}

export default Home;
