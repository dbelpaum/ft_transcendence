import React, { useState, useEffect, ChangeEvent, FormEvent  } from 'react';
import { Channel, ChannelCreate, ChannelUtility, MpChannel } from '../chat.interface';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContexte';
import { useNavigate } from 'react-router-dom';

interface CreateChannelsProps {
	channelUtility: ChannelUtility;
  }
const CreateChannel: React.FC<CreateChannelsProps> = ({ channelUtility }) => {

	const [showForm, setShowForm] = useState<boolean>(false);
	const [channelName, setChannelName] = useState<string>('');
	const [channelType, setChannelType] = useState('public');
	const [password, setPassword] = useState('');
	const {authToken} = useAuth();
	const useQuery = () => {
		return new URLSearchParams(useLocation().search);
	};
	const query = useQuery();
	const channelUrl = query.get('channel'); 
	const navigate = useNavigate();
	
	const handleCreateClick = () => {
		setShowForm(true);
	  };
	
	  const handleSubmitCreateChannel = (event: FormEvent<HTMLFormElement>) => {
		  event.preventDefault();
		  // Ici, vous pouvez ajouter la logique pour créer le channel
		if (channelName.trim() !== '' && channelUtility.me && channelUtility.socket) 
		{
			const newChannel : ChannelCreate = {
				name: channelName,
				user: channelUtility.me,
				type: channelType,
				mdp: password
			}
			channelUtility.socket.emit('join_channel', newChannel);
			try
			{

				const savedChannels: ChannelCreate[] = JSON.parse(localStorage.getItem('channels') || '[]');
				const channelExists = savedChannels.some(channel => channel.name === channelName);
				if (!channelExists)
				{
					const newChannels: ChannelCreate[]  = [...savedChannels, newChannel];
					localStorage.setItem('channels', JSON.stringify(newChannels));
				}
			}
			catch (error) {
				console.error('Error parsing JSON from localStorage:', error);
				console.error('Data that caused the error:', localStorage.getItem('channels'));
				// Gérez l'erreur ou initialisez savedChannels à une valeur par défaut
			}
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
			if (!channelUtility.socket) return
			if (channelUtility.me)
			{
				
				try {
					const responseChannels = await fetch('http://localhost:4000/channel/all/',
					{headers: {
						'Authorization': `Bearer ${authToken}`
					  }
					}
					  ); // URL de votre API
					if (!responseChannels.ok) {
						throw new Error(`Erreur HTTP : ${responseChannels.status}`);
					}
					const dataChannels : Channel[]= await responseChannels.json();
					channelUtility.setChannels(dataChannels); // Mise à jour de l'état avec les données de l'API

					const responseMps = await fetch('http://localhost:4000/channel/mp',
					{headers: {
						'Authorization': `Bearer ${authToken}`
					  }
					}
					  ); // URL de votre API
					if (!responseMps.ok) {
						throw new Error(`Erreur HTTP : ${responseMps.status}`);
					}
					const dataMps : MpChannel[]= await responseMps.json();
					channelUtility.setMpChannels(dataMps)
					if (channelUrl)
					{
						if (!dataChannels.some(c => c.name === channelUrl))
						{
							navigate('/chat');
						}
					}

		 		} catch (error) {
			  		console.error("Erreur lors de la récupération des channels:", error);
		  		}
			}
		};
	  
		// Démarrer avec un délai initial
		const timeoutId = setTimeout(() => {
		  fetchChannels(); // Premier appel
		  const intervalId = setInterval(fetchChannels, 10000); // Intervalle de 3 secondes
	  
		  // Nettoyer l'intervalle lors du démontage du composant
		  return () => {
			clearInterval(intervalId);
		  };
		}, 1000); // Délai initial de 2 secondes
	  
		// Nettoyer le timeout lors du démontage du composant
		return () => {
		  clearTimeout(timeoutId);
		};
	  }, [channelName, setChannelName, channelUtility.forceReload]);
	  

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




