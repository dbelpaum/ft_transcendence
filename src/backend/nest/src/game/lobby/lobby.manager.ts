import { Server } from "socket.io";
import { Lobby } from "./lobby";
import { AuthenticatedSocket } from "../types";
import { Cron } from "@nestjs/schedule";
import { ServerException } from "../ServerExceptions";
import { SocketExceptions } from "../shared/server/SocketExceptions";
import { LobbyMode } from "./types";
import { ServerEvents } from "../shared/server/ServerEvents";

export class LobbyManager {
	public server: Server;

	private readonly lobbies: Map<Lobby["id"], Lobby> = new Map<
		Lobby["id"],
		Lobby
	>();

	public initializeSocket(client: AuthenticatedSocket): void {
		client.data.lobby = null;
	}

	public terminateSocket(client: AuthenticatedSocket): void {
		client.data.lobby?.removeClient(client);
		console.log("Client %s disconnected", client.id);
	}

	private getUniqueCode(): string {
		let code: string;
		do {
			code = Math.floor(1000 + Math.random() * 9000).toString();
		} while (Array.from(this.lobbies.values()).some(lobby => lobby.id === code));
		return code;
	}

	public createLobby(mode: LobbyMode): Lobby {
		const lobby = new Lobby(this.server, mode, this.getUniqueCode(), this);
		this.lobbies.set(lobby.id, lobby);
		console.log("Created lobby %s", lobby.id);
		return lobby;
	}

	public deleteLobby(lobbyId: string): void {
		this.lobbies.delete(lobbyId);
		console.log(`Deleted lobby ${lobbyId}`);
	}

	public joinLobby(lobbyId: string, client: AuthenticatedSocket): void {
		const lobby = this.lobbies.get(lobbyId);

		if (!lobby) {
			throw new ServerException(
				SocketExceptions.LobbyError,
				"Lobby not found"
			);
		}

		if (lobby.clients.size >= lobby.maxClients) {
			throw new ServerException(
				SocketExceptions.LobbyError,
				"Lobby already full"
			);
		}

		lobby.addClient(client);
	}

	// Periodically clean up lobbies
	@Cron("*/1 * * * *")
	private lobbiesCleaner(): void {
		console.log("Remaining lobbies : " + this.lobbies.size);
		for (const [lobbyId, lobby] of this.lobbies) {
			console.log(lobbyId + ": " + lobby.clients.size + " clients");
		}
	}

	public joinMatchmaking(client: AuthenticatedSocket): void {
		// Check if there is an existing public lobby with available slots
		const publicLobby = Array.from(this.lobbies.values()).find(
			(lobby) => lobby.lobbyType === "public" && lobby.clients.size < lobby.maxClients
		);

		if (publicLobby) {
			// Join the existing public lobby
			this.joinLobby(publicLobby.id, client);
			console.log("Joined existing public lobby %s", publicLobby.id)
		} else {
			// Create a new public lobby if none is available
			const newPublicLobby = this.createLobby("vanilla");
			newPublicLobby.lobbyType = "public";
			this.joinLobby(newPublicLobby.id, client);
			console.log("Created new public lobby %s", newPublicLobby.id)
			client.emit(ServerEvents.MatchmakingStatus, { status: "joined" });
		}
	}

	public leaveMatchmaking(client: AuthenticatedSocket): void {
		client.data.lobby?.removeClient(client);
		client.emit(ServerEvents.MatchmakingStatus, { status: "left" });
	}
}
