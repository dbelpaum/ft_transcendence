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

	[ServerEvents.GameState]: {
		ballPosition: {
			x: number;
			y: number;
			z: number;
		};
		ballSpeedModifier: number;
		paddleOpponent: {
			x: number;
			y: number;
			z: number;
		};
		paddlePlayer: {
			x: number;
			y: number;
			z: number;
		};
		scores: Record<string, number>;
	};
};