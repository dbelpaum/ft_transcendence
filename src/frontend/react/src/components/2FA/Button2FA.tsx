import React, { useState, useEffect } from 'react';
import './Button2FA.css'; // Assurez-vous de créer ce fichier CSS
import { useAuth } from '../../context/AuthContexte';
import Modal2FA from './Modal2FA';

const Button2FA = () => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [showModal2FA, setShowModal2FA] = useState<boolean>(false);
  const [qrCodeImage, setQrCodeImage] = useState<string | undefined>(undefined);
  const {authToken} = useAuth()


  const toggleSwitch = () => {
	if (isActive) {
		disable2FA();
	} else {
		enable2FA();
	}
	setIsActive(!isActive);
    // Ajoutez ici la logique pour activer/désactiver la double authentification
  };

  	//Recupere en bdd si la double auth est adtive ou non
  useEffect(() => {
    fetch('http://localhost:4000/authentification/auth-enabled',
	{
		credentials: 'include',
		headers: {
		  'Authorization': `Bearer ${authToken}`
		}
	}) // Remplacez par l'URL appropriée de votre API
      .then(response => response.json())
      .then(
		data => {setIsActive(data.isActive);
		console.log("data renvoie ");
		console.log(data.isActive)}
		) // Supposons que 'isActive' est un booléen renvoyé par l'API
      .catch(error => console.error('Erreur lors de la vérification de la 2FA:', error));
  }, []);

  const enable2FA = () => {
    // Requête pour activer la 2FA
    const url = 'http://localhost:4000/authentification/2fa/turn-on';

    fetch(url, {
		method: 'POST',
		credentials: 'include',
		headers: {
			'Authorization': `Bearer ${authToken}`,
			'Content-Type': 'application/json'
		},
    })
    .then(response => response.json())
    .then(data => {
		setQrCodeImage(data.qrCode)
		setShowModal2FA(true)
		setIsActive(true);
		console.log("normalement, l'url")
		console.log(data.qrCode)
		console.log("2FA activée :", data);
    })
    .catch(error => console.error('Erreur lors de l\'activation de la 2FA:', error));
  };

  const disable2FA = () => {
    const url = 'http://localhost:4000/authentification/2fa/turn-off';

    fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      setIsActive(false);
    })
    .catch(error => console.error('Erreur lors de la désactivation de la 2FA:', error));
  };

  return (
	<div className="container-2fa">
	<button className={`switch-button ${isActive ? 'active' : ''}`} onClick={toggleSwitch}>
	</button>
	<p>
	  {isActive ? 'Double Auth ON' : 'Double Auth OFF'}
	</p>
	{showModal2FA && (
	  <Modal2FA onClose={() => setShowModal2FA(false)}>
		<img src={qrCodeImage} alt="QR Code pour la double authentification" />
	  </Modal2FA>
	)}
  </div>
  );
};

export default Button2FA;