import { io, Socket } from 'socket.io-client';
import { Dispatch, SetStateAction } from 'react';
import { User } from '../../context/AuthInteface';

  

  
// Interface for when server emits events to clients.
export interface ServerToClientEvents {
    chat: (e: Message) => void;
}
  
// Interface for when clients emit events to the server.
export interface ClientToServerEvents {
    chat: (e: Message) => void;
	join_channel: (e: ChannelCreate) => void
	invite: (e: InviteToChannel) => void
	add_admin: (e: addAdminInfo) => void
	remove_admin: (e: addAdminInfo) => void
}

export interface Channel {
	name: string
	host: string[]
	owner: User;
	users: User[]
	type: string
	mdp: string
	invited: User[]
}

export interface Message {
	id:string;
    user: User;
    timeSent?: string;
    message: string;
	channelName: string;
}
  
export interface ChannelUtility {
	me: User|null;
	socket: Socket<ServerToClientEvents, ClientToServerEvents>;
	channels: Channel[];
	setChannels: Dispatch<SetStateAction<Channel[]>>;
	message: Message[],
	recharger: () => void

  }

export interface ChannelCreate {
	name: string
	user: User
	type: string
	mdp: string
}

export interface InviteToChannel
{
	channel_name: string,
	invited_name: string,
	user: User
}

export interface addAdminInfo
{
	channel: string
	new_admin_name: string
	user: User
}