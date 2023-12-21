import React, { useState, useEffect } from 'react';


import {
	ChannelUtility
  } from '../chat.interface';
import CreateChannel from './CreateChannels';
import ChannelItem from './ChannelItem';



interface ChannelsProps {
	channelUtility: ChannelUtility;
  }
  
const Channels: React.FC<ChannelsProps> = ({ channelUtility }) => {

	return (
		<div className='channels'>
			<h2>Channels</h2>
			<div className='channel_container'>
			<CreateChannel channelUtility={channelUtility}/>
			<ul className='channel_list'>
				{channelUtility.channels.map((channel, index) => (
					<ChannelItem channelUtility={channelUtility} channel={channel} key={index}/>
				))}
			</ul>
			</div>
		</div>
	  );
};

export default Channels;