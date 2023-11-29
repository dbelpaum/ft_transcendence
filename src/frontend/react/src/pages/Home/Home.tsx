import React from 'react';
import './Home.css'; // Importation de styles spécifiques à la page d'accueil
import Title from '../../components/Title/Title';
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import accueil from './accueil.png';
import logo from './logo_pong.png'
import ButtonNav from '../../components/ButtonNav/ButtonNav';
import test from '../Chat/Chat'



interface HomeProps {}

function Home(props: HomeProps) {
    return (
        <main>
            {/* <Title></Title> */}
            <section className="image_test">
                <img src={logo} alt="Logo" />
            </section>
            <div className="button_auth">
                <ButtonNav text="Login with 42" color="DarkTurquoise" path='../OAuth'/>
                {/* <br/>
                <ButtonNav text="Login with Google" color="IndianRed" />
                <br/>
                <ButtonNav text="Sign in" color="purple" /> */}
            </div>
        </main>
    );
}

export default Home;
