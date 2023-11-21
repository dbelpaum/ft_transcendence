import React from 'react';
import './NavBar.css'; // Importation de styles spécifiques à la page d'accueil
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import manette from './manette-de-jeu.svg';
import chat from './chat.svg';
import profil from './profil.svg';



function NavBar() {
	const retirerActive = () => {
        document.body.classList.remove('active');
    };
	const active = () => {
		document.body.classList.toggle('active');
    };
	return (
		<nav class="nav">
			<div className="pie pie1" onClick={retirerActive}>
			<Link to="/game">
			<div className="pie-color pie-color1">
				<img src={manette} className='manette'/>
			</div>
			</Link>
			</div>
			<div className="pie pie2" onClick={retirerActive}>
			<Link to="/chat">
			<div className="pie-color pie-color2">
				<img src={chat} className='chat'/>
			</div>
			</Link>
			</div>
			<div className="pie pie3" onClick={retirerActive}>
			<Link to="/profil">
			<div className="pie-color pie-color3">
				<img src={profil} className='profil'/>
			</div>
			</Link>
			</div>
			<div className="menu" onClick={active}>
			<svg className="hamburger" xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
					<g
					fill="none"
					stroke="#000"
					strokeWidth="7.999"
					strokeLinecap="round"
					>
					<path d="M 55,26.000284 L 24.056276,25.999716" />
					<path d="M 24.056276,49.999716 L 75.943724,50.000284" />
					<path d="M 45,73.999716 L 75.943724,74.000284" />
					<path d="M 75.943724,26.000284 L 45,25.999716" />
					<path d="M 24.056276,73.999716 L 55,74.000284" />
					</g>
				</svg>
			</div>
	</nav>
	);
}


	// <nav>
	// 		<ul>
	// 			<li><Link to="/">Accueil</Link></li>
	// 			<li><Link to="/game">Jeu</Link></li>
	// 			<li><Link to="/chat">Chat</Link></li>
	// 			<li><Link to="/profil">Profil</Link></li>
	// 		</ul>
	// 	</nav>
export default NavBar;

