import { ServerEvents } from './ServerEvents';

export type ServerPayloads = {
	[ServerEvents.Pong]: {
		message: string;
	};

	[ServerEvents.LobbyState]: {
		lobbyId: string;
		hostId: string;
		guestId: string;
		hasStarted: boolean;
		hasFinished: boolean;
		isSuspended: boolean;
		playersCount: number;
		playersState: Record<string, boolean>;
		scores: Record<string, number>;
	};

	[ServerEvents.GameMessage]: {
		message: string;
	};
};