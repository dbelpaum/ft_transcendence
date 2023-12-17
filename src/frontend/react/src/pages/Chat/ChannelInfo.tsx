import React, { useState, useEffect } from 'react';
import {
	ChannelUtility
  } from './chat.interface';
import { useLocation } from 'react-router-dom';
import UserInfo from './UserInfo';
import { User } from '../../context/AuthInteface';
import InviteChannel from './InviteChannel';


interface ChannelWriteProps {
	channelUtility: ChannelUtility;
  }

interface UserAndAdmin {
	user: User;
	isAdmin: boolean;
	isOwner: boolean;
}
  
const ChannelInfo: React.FC<ChannelWriteProps> = ({ channelUtility }) => {

	const useQuery = () => {
		return new URLSearchParams(useLocation().search);
	};
	const query = useQuery();
	const channelUrl = query.get('channel'); 
	  if (!channelUrl) {
		return null;
	  }
	
	  const currentChannel = channelUtility.channels.find(channel => channel.name === channelUrl);
	  if (!currentChannel) {
		return null;
	  }
	
	  const uniqueUsersMap = new Map();
	
	  currentChannel.users.forEach(user => {
		if (!uniqueUsersMap.has(user.pseudo)) {
		  uniqueUsersMap.set(user.pseudo, user);
		}
	  });
	
	  const uniqueUsers = Array.from(uniqueUsersMap.values());

	  function isAdmin(user:User, admin:string[]) : boolean
	  {
		  return (admin.some(l => user.pseudo === l))
	  }
	  function isOwner(user:User, owner:User) : boolean
	  {
		  return (user.socketId === owner.socketId)
	  }
  
	  const userAndAdmin : UserAndAdmin[] = uniqueUsers.map(u => ({
			user: u,
			isAdmin: isAdmin(u, currentChannel.host),
			isOwner: isOwner(u, currentChannel.owner)
		}))

	return (
		<div className='channel-info'>
			<h3>Info : {currentChannel.name}</h3>
			{currentChannel ? (
			<>
				<p>{currentChannel.type}</p>
				{userAndAdmin.map((user, index) => (
					<UserInfo channelUtility={channelUtility} userAndAdmin={user} key={index} channelUrl={channelUrl} />
				))}
			</>
			) : null}
			<InviteChannel channelUrl={channelUrl} channelUtility={channelUtility} currentChannel={currentChannel}/>
		</div>
	)
};

export default ChannelInfo;