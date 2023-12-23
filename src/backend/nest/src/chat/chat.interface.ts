export interface User {
    id: number;
    pseudo: string;
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
	ban: string[]
	mute: string[]
}

export interface MpChannel
{
	user1: User,
	user2: User
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
	user_to_modify: User
	user: User
}

export interface UserTokenInfo{
	id: number,
	id42: number,
	pseudo: string,
	socketId: string
}

export interface Notif
{
	message: string,
	type: NotificationType
}

export type NotificationType = 'success' | 'danger' | 'info' | 'default' | 'warning';
