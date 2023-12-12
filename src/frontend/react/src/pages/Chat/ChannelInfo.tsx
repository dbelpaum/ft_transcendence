import React, { useState, useEffect } from 'react';
import {
	ChannelUtility
  } from './chat.interface';
import { useLocation } from 'react-router-dom';
import UserInfo from './UserInfo';

interface ChannelWriteProps {
	channelUtility: ChannelUtility;
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
	return (
		<div className='channel-info'>
			<h3>Info</h3>
			{currentChannel ? (
				uniqueUsers.map((userInChannel, index) => (
					<UserInfo channelUtility={channelUtility} userInChannel={userInChannel} key={index} channelUrl={channelUrl}/>
				))
			) : null}
		</div>
	)
};

export default ChannelInfo;