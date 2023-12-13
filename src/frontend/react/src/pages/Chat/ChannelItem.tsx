import React from 'react';
import {
	Channel,
	ChannelUtility
  } from './chat.interface';
import CreateChannel from './CreateChannels';
import { ReactComponent as LeaveIcon } from './leave.svg';
import { useNavigate } from 'react-router-dom';


interface ChannelsItemsProps {
	channelUtility: ChannelUtility;
	channel: Channel;
  }
  
const ChannelItem: React.FC<ChannelsItemsProps> = ({ channelUtility, channel }) => {

	const navigate = useNavigate();

	const handleChannelClick = () => {
	  navigate(`/chat?channel=${channel.name}`);
	};

	const handleSubmitLeaveChannel = () => {
		const savedChannels: {name: string}[] = JSON.parse(sessionStorage.getItem('channels') || '[]');
		const updatedChannels = savedChannels.filter(the_channel => the_channel.name !== channel.name);
		sessionStorage.setItem('channels', JSON.stringify(updatedChannels));
		window.location.reload();
	}



	const userInChannel = channel.users.some(u => u.socketId === channelUtility!.me!.socketId);

	const userIsAdmin = channel.host.some(u => u.id === channelUtility.me?.id);

	return (
		<li className='channel_item' onClick={handleChannelClick}>
							{/* {channel.isUserInChannel && <div className='status_indicator'></div>} */}
			<div className='channel_name'>
				{userInChannel &&
					<span className='channel_status'>
						<div className='status_indicator'></div>
					</span>}
				<span>
					{channel.name}{channel.type !== "public" && ` (${channel.type})`}
				</span>
			</div>
			<LeaveIcon 
				className='leave_icon' 
				onClick={handleSubmitLeaveChannel}
			/>
		</li>
	  );
};

export default ChannelItem;