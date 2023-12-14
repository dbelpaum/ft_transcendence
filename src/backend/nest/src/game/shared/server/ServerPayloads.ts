import { ServerEvents } from './ServerEvents';

export type ServerPayloads = {
	[ServerEvents.Pong]: {
		message: string;
	};

	[ServerEvents.LobbyState]: {
		lobbyId: string;
		hasStarted: boolean;
		hasFinished: boolean;
		isSuspended: boolean;
		playersCount: number;
		scores: Record<string, number>;
	};

	[ServerEvents.GameMessage]: {
		message: string;
	};
};