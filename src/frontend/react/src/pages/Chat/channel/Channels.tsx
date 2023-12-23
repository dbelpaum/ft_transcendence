import React, { useState, useEffect } from 'react';


import {
	ChannelUtility
  } from '../chat.interface';
import CreateChannel from './CreateChannels';
import ChannelItem from './ChannelItem';
import MpChannelItem from './MpChannelItem';



interface ChannelsProps {
	channelUtility: ChannelUtility;
  }
  
const Channels: React.FC<ChannelsProps> = ({ channelUtility }) => {

	if (!channelUtility.me) return null
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
			<h2>MP's</h2>

			<ul className='mp_list'>
				{channelUtility.mpChannels.map((mpChannel, index) => (
					<MpChannelItem channelUtility={channelUtility} mpChannel={mpChannel} key={index}/>
				))}
			</ul>
			</div>
		</div>
	  );
};

export default Channels;