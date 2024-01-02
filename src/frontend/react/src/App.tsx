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
import { ProtectedElement } from './components/Protection/ProtectedElement';
import { ReactNotifications, Store } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import ModalCode2FA from './components/2FA/ModalCode2FA';
import Historique from './pages/Historique/Historique';
import './components/responsive.css';



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
							<Route path="/game" element={<ProtectedElement><Game /></ProtectedElement>} />
							<Route path="/chat" element={<ProtectedElement><Chat /></ProtectedElement>} />
							<Route path="/profil" element={<ProtectedElement><Profil /></ProtectedElement>} />
							<Route path="/userlist" element={<ProtectedElement><UserList /></ProtectedElement>} />
							<Route path='/users/:pseudo' element={<ProtectedElement><UserProfile /></ProtectedElement>} />
							<Route path='/historique' element={<ProtectedElement><Historique /></ProtectedElement>} />
						</Routes>
					</div>
					<ModalCode2FA />
				</AuthProvider >
			</Router>
			
		</ErrorMessageProvider>
	);
}

export default App;
