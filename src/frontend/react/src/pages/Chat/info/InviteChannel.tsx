import React, { useState, useEffect } from 'react';
import {
	Channel,
	ChannelUtility
  } from '../chat.interface';
import { useLocation } from 'react-router-dom';
import UserInfo from './UserInfo';
import { User } from '../../../context/AuthInteface';
import { InviteToChannel } from '../chat.interface';
interface ChannelInviteProps {
	channelUtility: ChannelUtility;
	channelUrl: string;
	currentChannel: Channel
  }


const InviteChannel: React.FC<ChannelInviteProps> = ({ channelUtility, channelUrl, currentChannel }) => {
    const [inviteeName, setInviteeName] = useState('');
    const [showInviteForm, setShowInviteForm] = useState(false);

   

	function isAdmin(user:User, admin:string[]) : boolean
	  {
		  return (admin.some(l => user.pseudo === l))
	  }

	
	if (!channelUtility || !channelUtility.me)
	  return null
	if (currentChannel.type !== "private" || !isAdmin(channelUtility.me, currentChannel.host))
		return null

	const handleInvite = (e: React.FormEvent) => {
		e.preventDefault();
		// Logique pour envoyer l'invitation ici
		if (!channelUtility || !channelUtility.me || !channelUtility.socket)
			return
		const inviteToChannel : InviteToChannel = 
		{
			channel_name: currentChannel.name,
			invited_name: inviteeName,
			user: channelUtility.me
		}

		channelUtility.socket.emit('invite', inviteToChannel);

		
	};

    return (
        <div className="invite-container">
			<h3>Invitations</h3>
            
            {showInviteForm ? (
                <form onSubmit={handleInvite} className="invite-form">
                    <input
                        type="text"
                        value={inviteeName}
                        onChange={(e) => setInviteeName(e.target.value)}
                        placeholder="Nom de l'invité"
                        className="invite-input"
                    />
                    <button type="submit" className="invite-button">Envoyer Invitation</button>
                </form>
            ) :
			(
				<button 
					className="invite-toggle-button" 
					onClick={() => setShowInviteForm(!showInviteForm)}>
					Inviter
				</button>
			)}
        </div>
    );
}

export default InviteChannel;
