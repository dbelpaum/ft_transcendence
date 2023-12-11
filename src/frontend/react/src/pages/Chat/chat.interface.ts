import { io, Socket } from 'socket.io-client';
import { Dispatch, SetStateAction } from 'react';
import { User } from '../../context/AuthInteface';

  
export interface Message {
	id:string;
    user: User;
    timeSent?: string;
    message: string;
}
  
// Interface for when server emits events to clients.
export interface ServerToClientEvents {
    chat: (e: Message) => void;
}
  
// Interface for when clients emit events to the server.
export interface ClientToServerEvents {
    chat: (e: Message) => void;
	join_channel: (e: ChannelCreate) => void

}

export interface Channel {
	name: string
	host: User[]
	users: User[]
}
  
export interface ChannelUtility {
	me: User|null;
	socket: Socket<ServerToClientEvents, ClientToServerEvents>;
	channels: Channel[];
	setChannels: Dispatch<SetStateAction<Channel[]>>;
  }

export interface ChannelCreate {
	name: string
	user: User
}
