import { Server } from "socket.io";
import { Lobby } from "./lobby";
import { AuthenticatedSocket } from "../types";
import { Cron } from '@nestjs/schedule'
import { ServerException } from "../ServerExceptions";
import { SocketExceptions } from "../shared/server/SocketExceptions";
import { LobbyMode } from "./types";

export class LobbyManager {
	public server: Server;

	private readonly lobbies: Map<Lobby['id'], Lobby> = new Map<Lobby['id'], Lobby>();

	public initializeSocket(client: AuthenticatedSocket): void {
		client.data.lobby = null;
	}

	public terminateSocket(client: AuthenticatedSocket): void {
		client.data.lobby?.removeClient(client);
	}

	public createLobby(mode: LobbyMode): Lobby {
		const lobby = new Lobby(this.server, mode);
		this.lobbies.set(lobby.id, lobby);
		console.log("Created lobby %s", lobby.id);
		return lobby;
	}

	public joinLobby(lobbyId: string, client: AuthenticatedSocket): void {
		const lobby = this.lobbies.get(lobbyId);

		if (!lobby) {
			throw new ServerException(SocketExceptions.LobbyError, 'Lobby not found');
		}

		if (lobby.clients.size >= lobby.maxClients) {
			throw new ServerException(SocketExceptions.LobbyError, 'Lobby already full');
		}

		lobby.addClient(client);
	}

	// Periodically clean up lobbies
	@Cron('*/3 * * * *')
	private lobbiesCleaner(): void {
		console.log("Remaining lobbies : " + this.lobbies);
		console.log("Checking for empty lobbies...");
		for (const [lobbyId, lobby] of this.lobbies) {
			if (lobby.clients.size === 0) {
				this.lobbies.delete(lobbyId);
				console.log("Removed empty lobby %s", lobbyId);
			}
		}
	}
}