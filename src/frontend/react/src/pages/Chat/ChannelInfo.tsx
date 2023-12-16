import React, { useState, useEffect } from 'react';
import {
	ChannelUtility
  } from './chat.interface';
import { useLocation } from 'react-router-dom';
import UserInfo from './UserInfo';
import { User } from '../../context/AuthInteface';

interface ChannelWriteProps {
	channelUtility: ChannelUtility;
  }

interface UserAndAdmin {
	user: User;
	isAdmin: boolean;
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
		if (!uniqueUsersMap.has(user.login)) {
		  uniqueUsersMap.set(user.login, user);
		}
	  });
	
	  const uniqueUsers = Array.from(uniqueUsersMap.values());

	  function isAdmin(user:User, admin:User[]) : boolean
	  {
		  return (admin.some(u => user.login === u.login))
	  }
  
	  const userAndAdmin : UserAndAdmin[] = uniqueUsers.map(u => ({
			user: u,
			isAdmin: isAdmin(u, currentChannel.host),
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
		</div>
	)
};

export default ChannelInfo;