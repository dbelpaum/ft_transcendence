import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import './App.css';
import NavBar from './components/NavBar/NavBar'; 
import Home from './pages/Home/Home'; 
import Chat from './pages/Chat/Chat'; 
import Game from './pages/Game/Game'; 
import Profil from './pages/Profil/Profil'; 
// import Chat from './pages/Chat/Chat'; 


function App() {
	return (
		<Router>
		<div>
			<NavBar />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/game" element={<Game />} />
				<Route path="/chat" element={<Chat />} />
				<Route path="/profil" element={<Profil />} />
			</Routes>
		</div>
	  </Router>
	);
}

export default App;