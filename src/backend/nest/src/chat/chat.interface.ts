export interface User {
    id: number;
    login: string;
    email?: string;
	socketId: string
}
  
export interface Message {
    user: User;
    timeSent: string;
    message: string;
	channelName: string;
}
  
export interface ServerToClientEvents {
	chat: (e: Message) => void
  }
  
  export interface ClientToServerEvents {
	chat: (e: Message) => void
	join_channel: (e: { user: User; channelName: string }) => void
  }

export interface Channel {
	name: string
	host: User[]
	users: User[]
}