import { AuthenticatedSocket } from '../types';
import { Server, Socket } from 'socket.io';
import { Instance } from '../instance/instance';
import { ServerEvents } from '../shared/server/ServerEvents';
import { ServerPayloads } from '../shared/server/ServerPayloads';

export class Lobby {
	public readonly id: string = Math.floor(1000 + Math.random() * 9000).toString();

	public readonly maxClients: number = 2;

	public readonly createdAt: Date = new Date();

	public readonly clients: Map<Socket['id'], AuthenticatedSocket> = new Map<Socket['id'], AuthenticatedSocket>();

	public readonly instance: Instance = new Instance(this);

	constructor(
		private readonly server: Server,
		public readonly mode: string,
	) {
	}

	public addClient(client: AuthenticatedSocket): void {
		this.clients.set(client.id, client);
		client.join(this.id);
		client.data.lobby = this;

		//   if (this.clients.size >= this.maxClients) {
		// 	this.instance.triggerStart();
		//   }

		this.dispatchLobbyState();
	}

	public removeClient(client: AuthenticatedSocket): void {
		this.clients.delete(client.id);
		client.leave(this.id);
		client.data.lobby = null;

		//   // If player leave then the game isn't worth to play anymore
		//   this.instance.triggerFinish();

		//   // Alert the remaining player that client left lobby
		//   this.dispatchToLobby<ServerPayloads[ServerEvents.GameMessage]>(ServerEvents.GameMessage, {
		// 	color: 'blue',
		// 	message: 'Opponent left lobby',
		//   });

		this.dispatchLobbyState();
	}

	public dispatchLobbyState(): void {
		const payload: ServerPayloads[ServerEvents.LobbyState] = {
			lobbyId: this.id,
			hasStarted: this.instance.hasStarted,
			hasFinished: this.instance.hasFinished,
			playersCount: this.clients.size,
			isSuspended: this.instance.isSuspended,
			scores: this.instance.scores,
		};

		this.dispatchToLobby(ServerEvents.LobbyState, payload);
	}

	public dispatchToLobby<T>(event: ServerEvents, payload: T): void {
		this.server.to(this.id).emit(event, payload);
	}
}