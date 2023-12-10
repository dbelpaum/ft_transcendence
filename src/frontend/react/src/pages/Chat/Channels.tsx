import React from 'react';

import {
	ChannelUtility
  } from './chat.interface';


interface ChannelsProps {
	channelUtility: ChannelUtility;
  }
  
const Channels: React.FC<ChannelsProps> = ({ channelUtility }) => {
  return (
    <div className='channel_container'>
      {channelUtility.rooms.map((room, index) => (
         <div className='one_channel'>
		 	<span>{room.name}</span>
	   </div>
      ))}
    </div>
  );
};

export default Channels;