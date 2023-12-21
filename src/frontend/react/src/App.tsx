import React, { ReactNode, ReactElement, createContext, useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import './App.css';
import NavBar from './components/NavBar/NavBar'; 
import Home from './pages/Home/Home'; 
import Chat from './pages/Chat/Chat'; 
import Game from './pages/Game/Game'; 
import Profil from './pages/Profil/Profil';
import UserList from './pages/UserList/UserList'
import UserProfile from './pages/UserProfil/UserProfil';
// import Chat from './pages/Chat/Chat'; 
import { Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContexte'; 
import { ErrorMessageProvider, useErrorMessage } from './context/ErrorContexte';
import { ProtextedElement } from './components/Protection/ProtectedElement';
import { ReactNotifications, Store } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'



function App() {
	return (
		<ErrorMessageProvider>
			<ReactNotifications />
			
			<Router>
				<AuthProvider>

					<div>
						<NavBar />
						<Routes>
							<Route path="/" element={<Home />} />
							<Route path="/game" element={<Game />} />
							<Route path="/chat" element={<ProtextedElement><Chat /></ProtextedElement>} />
							<Route path="/profil" element={<ProtextedElement><Profil /></ProtextedElement>} />
							<Route path="/userlist" element={<ProtextedElement><UserList /></ProtextedElement>} />
							<Route path='/users/:pseudo' element={<ProtextedElement><UserProfile /></ProtextedElement>} />
						</Routes>
					</div>
				</AuthProvider >
			</Router>
			
		</ErrorMessageProvider>
	);
}

export default App;
