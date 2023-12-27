import { Socket } from 'socket.io';
import { Lobby } from './lobby/lobby';
import { ServerEvents } from './shared/server/ServerEvents';

export type AuthenticatedSocket = Socket & {
	data: {
		lobby: null | Lobby;
	};

	auth: {
		id: number,
		id42: number,
		pseudo: string,
		jwt: string,
		iat: number,
		exp: number,
		avatar: string
	}

	emit: <T>(ev: ServerEvents, data: T) => boolean;
};