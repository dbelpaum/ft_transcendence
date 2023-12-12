import React from 'react';
import {
  ChannelUtility,
	Message,
  } from './chat.interface';
import { User } from '../../context/AuthInteface';

interface userInfoProps {
  channelUtility: ChannelUtility;
  userInChannel: User;
	channelUrl: string|null;
}

const UserInfo: React.FC<userInfoProps> = ({ channelUtility, userInChannel, channelUrl }) => {



  return (
        <div className='userChannel'>
          <span>{userInChannel.login}</span>
        </div>
  );
};

export default UserInfo;