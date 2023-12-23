import React from 'react';
import {
	Channel,
	ChannelCreate,
	ChannelUtility,
	MpChannel
  } from '../chat.interface';
import CreateChannel from './CreateChannels';
import { ReactComponent as LeaveIcon } from '../assets/leave.svg';
import { useNavigate } from 'react-router-dom';


interface MpChannelsItemsProps {
	channelUtility: ChannelUtility;
	mpChannel: MpChannel;
  }
  
const MpChannelItem: React.FC<MpChannelsItemsProps> = ({ channelUtility, mpChannel }) => {
	
	const navigate = useNavigate();
	if (!channelUtility.me) return null

	const other = (mpChannel.user1.id === channelUtility.me.id) ? mpChannel.user2 : mpChannel.user1
	
	const handleChannelClick = () => {
		if (!channelUtility.me) return

		navigate(`/chat?mp=${other.pseudo}`);
	};
	


	return (
		<li className='mp_channel_item' onClick={handleChannelClick}>
			<div className='mp_channel_name'>
					{/* <span className='channel_status'>
						<div className='status_indicator'></div>
					</span> */}
					{other.pseudo}
			</div>
		</li>
	  );
};

export default MpChannelItem;