import { Injectable } from '@nestjs/common';

import { Server } from "socket.io";
import { Lobby } from "./lobby";
import { AuthenticatedSocket } from "../types";
import { Cron } from "@nestjs/schedule";
import { ServerException } from "../ServerExceptions";
import { SocketExceptions } from "../shared/server/SocketExceptions";
import { LobbyMode } from "./types";
import { ServerEvents } from "../shared/server/ServerEvents";
import { jwtDecode } from "jwt-decode";

import { PrismaService } from "src/prisma.service";

@Injectable()
export class LobbyManager {
	constructor(private prisma: PrismaService){}
	public server: Server;

	private readonly lobbies: Map<Lobby["id"], Lobby> = new Map<
		Lobby["id"],
		Lobby
	>();

	public async initializeSocket(client: AuthenticatedSocket): Promise<void> {
		try {
			const token = client.handshake.auth.token;
			const payload = jwtDecode(token) as any;
			const user = await this.prisma.user.findUnique({
				where: { id: payload.id },
				select: { imageURL: true }
			  });
			
			  if (!user) {
				throw new Error("User not found");
			  }
			const imageURL =  (user && user.imageURL) ? user.imageURL : "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/MCM_London_May_15_-_Stormtrooper_%2818246218651%29.jpg/1280px-MCM_London_May_15_-_Stormtrooper_%2818246218651%29.jpg"
			client.auth = {
				id: payload.id,
				id42: payload.id42,
				pseudo: payload.pseudo,
				jwt: token,
				iat: payload.iat,
				exp: payload.exp,
				avatar: imageURL	// A changer avec une requête bdd ou autre
			}
			// console.log(client);
		} catch (e) {
			console.log(e)
			client.disconnect(); // Déconnectez le client en cas d'échec de la vérification
			return;
		}
		client.data.lobby = null;
	}

	public terminateSocket(client: AuthenticatedSocket): void {
		if (client.data.lobby?.instance.hasStarted && !client.data.lobby.instance.hasFinished) {
			client.data.lobby?.instance.gameAbort(client);
		}
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

	private isUserInAnyLobby(client: AuthenticatedSocket): boolean {
		for (const lobby of this.lobbies.values()) {
			for (const lobbyClient of lobby.clients.values()) {
				if (lobbyClient.auth.pseudo === client.auth.pseudo) return true;
			}
		}
		return false;
	}

	public createLobby(mode: LobbyMode, client: AuthenticatedSocket): Lobby {
		if (this.isUserInAnyLobby(client)) {
			throw new ServerException(
				SocketExceptions.LobbyError,
				"Already in a lobby"
			);
		}
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

		if (this.isUserInAnyLobby(client)) {
			throw new ServerException(
				SocketExceptions.LobbyError,
				"Already in a lobby"
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
		if (this.isUserInAnyLobby(client)) {
			throw new ServerException(
				SocketExceptions.LobbyError,
				"Already in a lobby"
			);
		}
		const publicLobby = Array.from(this.lobbies.values()).find(
			(lobby) => lobby.lobbyType === "public" && lobby.clients.size < lobby.maxClients
		);

		if (publicLobby) {
			// Join the existing public lobby
			this.joinLobby(publicLobby.id, client);
			console.log("Joined existing public lobby %s", publicLobby.id)
		} else {
			// Create a new public lobby if none is available
			const newPublicLobby = this.createLobby("vanilla", client);
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
