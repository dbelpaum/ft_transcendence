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
import { ProtectedChat } from './pages/Chat/ProtectedChat';
import { ReactNotifications, Store } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'



function App() {
	return (
		<ErrorMessageProvider>
			<ReactNotifications />
			<AuthProvider>
			
			<Router>

					<div>
						<NavBar />
						<Routes>
							<Route path="/" element={<Home />} />
							<Route path="/game" element={<Game />} />
							<Route path="/chat" element={<ProtectedChat><Chat /></ProtectedChat>} />
							<Route path="/profil" element={<ProtectedChat><Profil /></ProtectedChat>} />
							<Route path="/userlist" element={<ProtectedChat><UserList /></ProtectedChat>} />
							<Route path='/users/:pseudo' element={<ProtectedChat><UserProfile /></ProtectedChat>} />
						</Routes>
					</div>
				</Router>
			</AuthProvider >
		</ErrorMessageProvider>
	);
}

export default App;
