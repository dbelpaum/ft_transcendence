import React, { useState, useEffect, ChangeEvent, FormEvent  } from 'react';
import { ChannelCreate, ChannelUtility } from './chat.interface';


interface CreateChannelsProps {
	channelUtility: ChannelUtility;
  }
const CreateChannel: React.FC<CreateChannelsProps> = ({ channelUtility }) => {

	const [showForm, setShowForm] = useState<boolean>(false);
	const [channelName, setChannelName] = useState<string>('');

	const handleCreateClick = () => {
		setShowForm(true);
	  };
	
	  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		setChannelName(event.target.value);
	  };
	
	  const handleSubmitCreateChannel = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		// Ici, vous pouvez ajouter la logique pour créer le channel
		if (channelName.trim() !== '' && channelUtility.me ) 
		{
			const newChannel : ChannelCreate = {
				name: channelName,
				user: channelUtility.me
			}
			channelUtility.socket.emit('join_channel', newChannel);

			const savedChannels: {name: string}[] = JSON.parse(sessionStorage.getItem('channels') || '[]');
			const newChannels: {name: string}[]  = [...savedChannels, { name: channelName }];
			sessionStorage.setItem('channels', JSON.stringify(newChannels));
		}
		setChannelName("");

	  };

	  useEffect(() => {
		const fetchChannels = async () => {
		  try {
			const response = await fetch('http://localhost:4000/channel/all'); // URL de votre API
			if (!response.ok) {
			  throw new Error(`Erreur HTTP : ${response.status}`);
			}
			const data = await response.json();
			channelUtility.setChannels(data); // Mise à jour de l'état avec les données de l'API
		  } catch (error) {
			console.error("Erreur lors de la récupération des channels:", error);
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
    <div>
      {!showForm ? (
        <button onClick={handleCreateClick}>Créer channel</button>
      ) : (
        <form onSubmit={handleSubmitCreateChannel}>
          <input
            type="text"
            placeholder="Nom du channel"
            value={channelName}
            onChange={handleInputChange}
          />
          <button type="submit">Créer</button>
        </form>
      )}
    </div>
  );
};

export default CreateChannel;




