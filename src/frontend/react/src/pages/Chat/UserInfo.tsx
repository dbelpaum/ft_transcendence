import React from 'react';
import {
  ChannelUtility,
	Message,
  } from './chat.interface';
import { User } from '../../context/AuthInteface';
import crownIconPath from './couronne.svg';

interface UserAndAdmin {
	user: User;
	isAdmin: boolean;
}

interface userInfoProps {
  channelUtility: ChannelUtility;
  userAndAdmin: UserAndAdmin;
	channelUrl: string|null;
}

const UserInfo: React.FC<userInfoProps> = ({ channelUtility, userAndAdmin, channelUrl }) => {
  return (
        <div className='userChannel'>
			<span><img src={crownIconPath} alt="Couronne" className="crownIcon" /></span>
          	<span>{userAndAdmin.user.login}</span>
			<span className="button">
				<span>Kick</span>
				<span>Ban</span>
				<span>Mute</span>
			</span>
        </div>
  );
};

export default UserInfo;