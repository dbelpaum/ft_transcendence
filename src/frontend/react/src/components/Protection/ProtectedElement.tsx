import React, { ReactElement, useEffect } from 'react';


// import Chat from './pages/Chat/Chat'; 
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContexte'; 
import { useErrorMessage } from '../../context/ErrorContexte';


type ProtectedElementProps = {
	children: ReactElement;
  };

export const ProtectedElement: React.FC<ProtectedElementProps> = ({ children }) => {

	const { user, isLoading } = useAuth(); 
	const { setErrorMessage } = useErrorMessage();

	useEffect(() => {
		if (!isLoading && !user) {
			setErrorMessage({
				message: 'Vous devez être connecté pour accéder à cette page.',
				type: 'error'
			});
			console.log(user)
		}
	}, [user, isLoading, setErrorMessage]);
	
	if (isLoading) {
		return <div>Chargement...</div>;
	}
	
	if (!user) {
		console.log("je passe par la")
		return <Navigate to="/" />;
	}
	return children
};