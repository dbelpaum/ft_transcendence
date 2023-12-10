import React, { useState, useEffect } from 'react';

import './ErrorModule.css'; // Importation de styles spécifiques à la page d'accueil
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import { useErrorMessage } from '../../context/ErrorContexte'; 



function ErrorModule(){

	const { errorMessage, setErrorMessage } = useErrorMessage(); 
    const [visible, setVisible] = useState(true);

    const clearError = () => {
        setVisible(false);
        setTimeout(() => {
          setErrorMessage({ ...errorMessage, type: "hidden" });
        }, 500); // Correspond à la durée de l'animation CSS
      };


      useEffect(() => {
        // Si il y a un message d'erreur, définissez un timer pour le supprimer après 10 secondes
        if (errorMessage) {
          const timer = setTimeout(() => {
            clearError();
          }, 3000);
    
          // Nettoyer le timer si le composant est démonté ou si le message change
          return () => clearTimeout(timer);
        }
      }, [errorMessage, clearError]);


     // Vérifiez si `user` est non-null et non-vide
  if (!errorMessage || Object.keys(errorMessage).length === 0 || errorMessage.type == "hidden") {
    return null; 
  }
  return (
     <div className={`alert ${errorMessage.type} ${!visible ? 'fadeOut' : ''}`}>
        <span className="alertClose" onClick={clearError}>X</span>
        <span className="alertText">{ errorMessage.message }<br />
        <br className="clear"/></span>
    </div>
  );
}

export default ErrorModule;