import React, { ReactElement, useEffect } from 'react';


// import Chat from './pages/Chat/Chat'; 
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContexte'; 
import { useErrorMessage } from '../../context/ErrorContexte';


type ProtectedChatProps = {
	children: ReactElement;
  };

export const ProtectedChat: React.FC<ProtectedChatProps> = ({ children }) => {

	const { user } = useAuth(); 
	const { setErrorMessage } = useErrorMessage();

	useEffect(() => {
		if (!user) {
		  setErrorMessage({
			message: 'Vous devez être connecté pour accéder à cette page.',
			type: 'error'
		  });
		}
	  }, [user, setErrorMessage]);

	if (!user) {
	  return <Navigate to="/" />;
	}
	return children
};