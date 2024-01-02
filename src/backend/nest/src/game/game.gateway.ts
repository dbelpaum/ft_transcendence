import { SubscribeMessage, WebSocketGateway, WsResponse, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { UsePipes } from '@nestjs/common';
import { WsValidationPipe } from 'src/game/validation-pipe';
import { Server, Socket } from 'socket.io';
import { ServerEvents } from 'src/game/shared/server/ServerEvents';
import { ClientEvents } from 'src/game/shared/client/ClientEvents';
import { ServerPayloads } from 'src/game/shared/server/ServerPayloads';
import { LobbyManager } from './lobby/lobby.manager';
import { AuthenticatedSocket } from './types';
import { ClientMovementDto, LobbyCreateDto, LobbyJoinDto } from './dtos';

@UsePipes(new WsValidationPipe())
@WebSocketGateway({ namespace: 'game' })
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

	constructor(
		private readonly lobbyManager: LobbyManager,
	) {
	}

	afterInit(server: Server): any {
		// Pass server instance to managers
		this.lobbyManager.server = server;
	}

	async handleConnection(client: Socket, ...args: any[]): Promise<void> {
		this.lobbyManager.initializeSocket(client as AuthenticatedSocket);
	}

	async handleDisconnect(client: AuthenticatedSocket): Promise<void> {
		// Handle termination of socket
		this.lobbyManager.terminateSocket(client);
	}

	@SubscribeMessage(ClientEvents.Ping)
	onPing(client: Socket): void {
		client.emit(ServerEvents.Pong, {
			message: 'pong',
		});
	}

	@SubscribeMessage(ClientEvents.LobbyCreate)
	onLobbyCreate(client: AuthenticatedSocket, data: LobbyCreateDto): WsResponse<ServerPayloads[ServerEvents.GameMessage]> {
		const lobby = this.lobbyManager.createLobby(data.mode, client);
		lobby.addClient(client);
		return {
			event: ServerEvents.GameMessage,
			data: {
				message: 'Lobby created',
			},
		};
	}

	@SubscribeMessage(ClientEvents.LobbyJoin)
	onLobbyJoin(client: AuthenticatedSocket, data: LobbyJoinDto): void {
		this.lobbyManager.joinLobby(data.lobbyId, client);
	}

	@SubscribeMessage(ClientEvents.LobbyLeave)
	onLobbyLeave(client: AuthenticatedSocket): void {
		client.data.lobby?.removeClient(client);
	}

	@SubscribeMessage(ClientEvents.ClientReady)
	onClientReady(client: AuthenticatedSocket): void {
		client.data.lobby?.setReadyStatus(client, true);
	}

	@SubscribeMessage(ClientEvents.ClientUnready)
	onClientUnready(client: AuthenticatedSocket): void {
		client.data.lobby?.setReadyStatus(client, false);
	}

	@SubscribeMessage(ClientEvents.ClientMovement)
	onClientMovement(client: AuthenticatedSocket, data: ClientMovementDto): void {
		client.data.lobby?.instance.clientMove(client.id, data);
	}

	@SubscribeMessage(ClientEvents.MatchmakingJoin)
	onMatchmakingJoin(client: AuthenticatedSocket): void {
		this.lobbyManager.joinMatchmaking(client);
	}

	@SubscribeMessage(ClientEvents.MatchmakingLeave)
	onMatchmakingLeave(client: AuthenticatedSocket): void {
		this.lobbyManager.leaveMatchmaking(client);
	}
}