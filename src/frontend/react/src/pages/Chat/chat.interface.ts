import { io, Socket } from 'socket.io-client';

export interface User {
    id: number;
    login: string;
    email?: string;
}
  
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
}

export interface Room {
	name: string
	host: User|null
	users: User[]
  }
  
export interface ChannelUtility {
	me: User|null;
	socket: Socket<ServerToClientEvents, ClientToServerEvents>;
	rooms: Room[];
  }