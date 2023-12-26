// lobby.ts
import { AuthenticatedSocket } from "../types";
import { Server, Socket } from "socket.io";
import { Instance } from "../instance/instance";
import { ServerEvents } from "../shared/server/ServerEvents";
import { ServerPayloads } from "../shared/server/ServerPayloads";
import { LobbyManager } from "./lobby.manager";

export class Lobby {
	public lobbyType = "private";
	public readonly maxClients: number = 2;
	public readonly createdAt: Date = new Date();
	public hostSocketId: Socket["id"];
	public guestSocketId: Socket["id"];
	public readonly clients: Map<Socket["id"], AuthenticatedSocket> = new Map<
		Socket["id"],
		AuthenticatedSocket
	>();
	public readonly instance: Instance = new Instance(this);
	public readonly readyStatus: Map<Socket["id"], boolean> = new Map<
		Socket["id"],
		boolean
	>();

	constructor(
		private readonly server: Server,
		public readonly mode: string,
		public readonly id: string,
		private readonly lobbyManager: LobbyManager
	) { }

	public addClient(client: AuthenticatedSocket): void {
		this.clients.set(client.id, client);
		client.join(this.id);
		client.data.lobby = this;
		this.readyStatus.set(client.id, false);

		if (!this.hostSocketId) this.hostSocketId = client.id;
		else this.guestSocketId = client.id;

		if (this.lobbyType === "private")
			this.dispatchLobbyState();
		else if (this.lobbyType === "public" && this.clients.size === 2) {
			this.dispatchLobbyState();
			this.dispatchToLobby(ServerEvents.MatchmakingFound, {});
			this.instance.triggerStart();
		}
	}

	public removeClient(client: AuthenticatedSocket): void {
		this.clients.delete(client.id);
		// Si l'hôte leave, alors le guest devient hôte
		if (client.id === this.hostSocketId) {
			this.hostSocketId = this.guestSocketId ? this.guestSocketId : null;
			this.guestSocketId = null;
		} else this.guestSocketId = null;
		client.leave(this.id);
		client.data.lobby = null;
		if (this.clients.size === 0)
			this.lobbyManager.deleteLobby(this.id);

		this.dispatchLobbyState();
	}

	private isAllReady(): boolean {
		for (const ready of this.readyStatus.values()) if (!ready) return false;
		return true;
	}

	public setReadyStatus(client: AuthenticatedSocket, isReady: boolean): void {
		this.readyStatus.set(client.id, isReady);
		this.dispatchLobbyState();
		// Check si tous les clients sont ready
		if (this.clients.size >= this.maxClients && this.isAllReady()) {
			this.instance.triggerStart();
		}
	}

	public dispatchLobbyState(): void {
		const playersStateObject: Record<string, boolean> = {};
		this.readyStatus.forEach((value, key) => {
			playersStateObject[key] = value;
		});

		const payload: ServerPayloads[ServerEvents.LobbyState] = {
			lobbyType: this.lobbyType,
			lobbyId: this.id,
			hostId: this.hostSocketId,
			guestId: this.guestSocketId,
			hasStarted: this.instance.hasStarted,
			hasFinished: this.instance.hasFinished,
			playersCount: this.clients.size,
			playersState: playersStateObject,
			isSuspended: this.instance.isSuspended,
			scores: this.instance.scores,
		};

		this.dispatchToLobby(ServerEvents.LobbyState, payload);
	}

	public dispatchToLobby<T>(event: ServerEvents, payload: T): void {
		this.server.to(this.id).emit(event, payload);
	}

	public sendToUser<T>(
		userId: Socket["id"],
		event: ServerEvents,
		payload: T
	): void {
		if (this.clients.has(userId)) {
			this.server.to(userId).emit(event, payload);
		}
	}
}
