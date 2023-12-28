import { ServerEvents } from './ServerEvents';

export type ServerPayloads = {
	[ServerEvents.Pong]: {
		message: string;
	};

	[ServerEvents.LobbyState]: {
		lobbyType: string;
		lobbyId: string;
		hasStarted: boolean;
		hasFinished: boolean;
		isSuspended: boolean;
		playersCount: number;
		playersState: Record<string, boolean>;
		scores: Record<string, number>;
		host: { socketId: string, pseudo: string, avatar: string },
		guest: { socketId: string, pseudo: string, avatar: string },
		name
	};

	[ServerEvents.GameOver]: {
		winner: string;
		loser: string;
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