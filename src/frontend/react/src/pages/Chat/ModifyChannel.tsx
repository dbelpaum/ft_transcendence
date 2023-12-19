import React, { useState, useEffect, ChangeEvent, FormEvent  } from 'react';
import {
	Channel,
	ChannelCreate,
	ChannelUtility
  } from './chat.interface';
import { useLocation } from 'react-router-dom';
import UserInfo from './UserInfo';
import { User } from '../../context/AuthInteface';


interface ModifyChannelProps {
	channelUtility: ChannelUtility;
	channelUrl: string;
	currentChannel: Channel
  }


const ModifyChannel: React.FC<ModifyChannelProps> = ({ channelUtility, channelUrl, currentChannel }) => {
    const [modifiedMdp, setModifiedMdp] = useState('');
    const [showModifyForm, setShowModifyForm] = useState(false);
	const [channelType, setChannelType] = useState(currentChannel.type);

	const handleTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
		setChannelType(event.target.value);
	  };
	  
	  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
		setModifiedMdp(event.target.value);
	  };

	  function isOwner(user:User, owner:User) : boolean
	  {
		  return (user.socketId === owner.socketId)
	  }

	
	if (!channelUtility || !channelUtility.me)
	  return null
	if (!isOwner(channelUtility.me, currentChannel.owner))
		return null

	const handleModifyChannel = (e: React.FormEvent) => {
		e.preventDefault();
		// Logique pour envoyer l'invitation ici
		if (!channelUtility || !channelUtility.me)
			return
		const modifiedChannel : ChannelCreate = {
			name: currentChannel.name,
			user: channelUtility.me,
			type: channelType,
			mdp: modifiedMdp
		}

		channelUtility.socket.emit('modify_channel', modifiedChannel);
		console.log(modifiedChannel)
		var savedChannels: ChannelCreate[] = JSON.parse(sessionStorage.getItem('channels') || '[]');
		savedChannels = savedChannels.filter(chan => chan.name !== modifiedChannel.name)
		const newChannels: ChannelCreate[]  = [...savedChannels, modifiedChannel];
		sessionStorage.setItem('channels', JSON.stringify(newChannels));
	};
    return (
        <div className="modify-channel-container">
			<h3>Modifier le channel</h3>
            
            {showModifyForm ? (
                <form onSubmit={handleModifyChannel} className="modify-channel-form channel-form">
                   	<select value={channelType} onChange={handleTypeChange}>
						<option value="public">Public</option>
						<option value="private">Private</option>
						<option value="protected">Protected</option>
					</select>
			
					{channelType === 'protected' && (
						<input
						type="password"
						placeholder="Mot de passe du channel"
						value={modifiedMdp}
						onChange={handlePasswordChange}
						/>
					)}
			
					<button type="submit">Modifier</button>
                </form>
            ) :
			(
				<button 
					className="create-channel-button" 
					onClick={() => setShowModifyForm(!showModifyForm)}>
					Modifier le channel
				</button>
			)}
        </div>
    );
}

export default ModifyChannel;
