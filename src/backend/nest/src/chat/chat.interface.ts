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
	host: string[]
	owner: User;
	users: User[]
	type: string
	mdp: string
	invited: string[]
}

export interface ChannelCreate {
	name: string
	user: User
	type: string
	mdp: string
}

export interface joinResponse {
	errorNumber: number  //0 si tout vas bien
	text: string
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