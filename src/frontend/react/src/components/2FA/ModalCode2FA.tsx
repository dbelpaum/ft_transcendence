import React, { useState, useEffect } from 'react';
import './ModalCode2FA.css'; // Assurez-vous d'importer le fichier CSS
import { useAuth } from '../../context/AuthContexte';
import ValidIcon from './verifier.svg';
import { showNotification } from '../../pages/Game/Notification';


const ModalCode2FA: React.FC = () => {
  const [code, setCode] = useState<string>('');
  const { info2FA, setInfo2FA, authToken, setAuthToken } = useAuth();


  useEffect(() => {
    // Vérifier si 6 chiffres ont été entrés (sans compter les espaces)
    if (code.replace(/\s/g, '').length === 6) {
      send2FACode();
    }
  }, [code]); 

  const send2FACode = async () => {
	try {
	  // Remplacer par l'URL de votre API et les détails nécessaires
	  const codeSansEspace = code.replace(/\s+/g, '');
	  const response = await fetch('http://localhost:4000/authentification/2fa/validate', {
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json',
			'Authorization': `Bearer ${authToken}`

		},
		body: JSON.stringify({
			twoFactorAuthenticationCode: codeSansEspace,
		}),
	  });
  
	  const data = await response.json();
  
	  if (data.success) {
		// Authentification réussie, stocker le nouveau token
		localStorage.setItem('token', data.newToken);
		window.location.href = "http://localhost:3000/profil"
	  } else {
		// Authentification échouée
		showNotification("Authentification à 2 facteurs", "L'authentification a échoué", "warning")
	  }
	} catch (error) {
	  console.error('Erreur lors de l’envoi du code 2FA', error);
	}
	setCode("")
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value;
    // Filtrer les caractères non numériques et ajouter un espace après 3 chiffres
    input = input.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1 $2');
    setCode(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      send2FACode();
    }
  };

  const handleClose = () => setInfo2FA(null);

  if (!info2FA) return null;

  return (
    <div className="modal-code-2fa">
		<div className="modal-container">
			<button className="modal-close-btn" onClick={handleClose}>×</button>
			<h2>2 Factor Authentification</h2>
			<p>Veuillez entrer le code de vérification généré par votre application Google Authenticator pour {info2FA.pseudo}</p>
			<div className="container-code">
			<input 
				type="text" 
				className="code-input" 
				value={code} 
				onChange={handleInputChange}
				onKeyDown={handleKeyDown}
				placeholder="000 000"
				maxLength={7} // Pour 6 chiffres et 1 espace
			/>
			<button className="submit-btn" onClick={send2FACode}>
				<img src={ValidIcon} alt="Valider" />
			</button>


			</div>
		</div>
    </div>
  );
};




export default ModalCode2FA;
