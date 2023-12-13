import React, { useState, useEffect, ChangeEvent, FormEvent  } from 'react';
import { ChannelCreate, ChannelUtility } from './chat.interface';


interface CreateChannelsProps {
	channelUtility: ChannelUtility;
  }
const CreateChannel: React.FC<CreateChannelsProps> = ({ channelUtility }) => {

	const [showForm, setShowForm] = useState<boolean>(false);
	const [channelName, setChannelName] = useState<string>('');
	const [channelType, setChannelType] = useState('public');
	const [password, setPassword] = useState('');
	
	const handleCreateClick = () => {
		setShowForm(true);
	  };
	
	  const handleSubmitCreateChannel = (event: FormEvent<HTMLFormElement>) => {
		  event.preventDefault();
		  // Ici, vous pouvez ajouter la logique pour créer le channel
		if (channelName.trim() !== '' && channelUtility.me ) 
		{
			const newChannel : ChannelCreate = {
				name: channelName,
				user: channelUtility.me,
				type: channelType,
				mdp: password
			}
			channelUtility.socket.emit('join_channel', newChannel);
			
			const savedChannels: {name: string}[] = JSON.parse(sessionStorage.getItem('channels') || '[]');
			const newChannels: {name: string}[]  = [...savedChannels, { name: channelName }];
			sessionStorage.setItem('channels', JSON.stringify(newChannels));
		}
		setChannelName("");
		
	};

	const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		setChannelName(event.target.value);
		};
	
	
	  const handleTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
		setChannelType(event.target.value);
	  };
	  
	  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
		setPassword(event.target.value);
	  };
	  

	  useEffect(() => {
		const fetchChannels = async () => {
			if (channelUtility.me)
			{

				try {
					const response = await fetch('http://localhost:4000/channel/all/' + channelUtility.me.login); // URL de votre API
					if (!response.ok) {
						throw new Error(`Erreur HTTP : ${response.status}`);
					}
					const data = await response.json();
					channelUtility.setChannels(data); // Mise à jour de l'état avec les données de l'API
		 		} catch (error) {
			  		console.error("Erreur lors de la récupération des channels:", error);
		  		}
			}
		};
	  
		// Démarrer avec un délai initial
		const timeoutId = setTimeout(() => {
		  fetchChannels(); // Premier appel
		  const intervalId = setInterval(fetchChannels, 20000); // Intervalle de 3 secondes
	  
		  // Nettoyer l'intervalle lors du démontage du composant
		  return () => {
			clearInterval(intervalId);
		  };
		}, 1000); // Délai initial de 2 secondes
	  
		// Nettoyer le timeout lors du démontage du composant
		return () => {
		  clearTimeout(timeoutId);
		};
	  }, [channelName, setChannelName]);
	  

	  return (
		<div className="create-form-container">
			{showForm ? (
				<form onSubmit={handleSubmitCreateChannel} className="channel-form">
					<input
						type="text"
						placeholder="Nom du channel"
						value={channelName}
						onChange={handleInputChange}
					/>
					<select value={channelType} onChange={handleTypeChange}>
						<option value="public">Public</option>
						<option value="private">Private</option>
						<option value="protected">Protected</option>
					</select>
			
					{channelType === 'protected' && (
						<input
						type="password"
						placeholder="Mot de passe du channel"
						value={password}
						onChange={handlePasswordChange}
						/>
					)}
			
					<button type="submit">Créer</button>
				</form>
			) : 
			(<button className="create-channel-button" onClick={() => setShowForm(true)}>Créer un channel</button>)}
		</div>
	  );
}

export default CreateChannel;




