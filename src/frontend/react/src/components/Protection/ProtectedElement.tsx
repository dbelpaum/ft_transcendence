import React, { ReactElement, useEffect } from 'react';


// import Chat from './pages/Chat/Chat'; 
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContexte'; 
import { useErrorMessage } from '../../context/ErrorContexte';
import { showNotification } from '../../pages/Game/Notification';

type ProtectedElementProps = {
	children: ReactElement;
  };

export const ProtectedElement: React.FC<ProtectedElementProps> = ({ children }) => {

	const { user, isLoading } = useAuth(); 
	const { setErrorMessage } = useErrorMessage();

	useEffect(() => {
		if (!isLoading && !user) {
			showNotification("Acces interdit", "Vous devez être connecté pour accéder à cette page.", "warning")
		}
	}, [user, isLoading]);
	
	if (isLoading) {
		return <div>Chargement...</div>;
	}
	
	if (!user) {
		return <Navigate to="/" />;
	}
	return children
};