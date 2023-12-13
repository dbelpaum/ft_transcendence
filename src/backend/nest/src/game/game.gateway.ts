import { SubscribeMessage, WebSocketGateway, WsResponse, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { UsePipes } from '@nestjs/common';
import { WsValidationPipe } from 'src/game/validation-pipe';
import { Server, Socket } from 'socket.io';
import { ServerEvents } from 'src/game/shared/server/ServerEvents';
import { ClientEvents } from 'src/game/shared/client/ClientEvents';
import { ServerPayloads } from 'src/game/shared/server/ServerPayloads';
import { LobbyManager } from './lobby/lobby.manager';
import { AuthenticatedSocket } from './types';
import { LobbyCreateDto, LobbyJoinDto } from './dtos';

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
		console.log('Game server initialized !');
	}

	async handleConnection(client: Socket, ...args: any[]): Promise<void> {
		// from here you can verify if the user is authenticated correctly,
		// you can perform whatever operation (database call, token check, ...) 
		// you can disconnect client if it didn't match authentication criterias
		// you can also perform other operations, such as initializing socket attached data 
		// or whatever you would like upon connection
		this.lobbyManager.initializeSocket(client as AuthenticatedSocket);
	}

	async handleDisconnect(client: AuthenticatedSocket): Promise<void> {
		// Handle termination of socket
		this.lobbyManager.terminateSocket(client);
	}

	@SubscribeMessage(ClientEvents.Ping)
	onPing(client: Socket): void {
		console.log("Received event :" + ClientEvents.Ping);
		client.emit(ServerEvents.Pong, {
			message: 'pong',
		});
	}

	@SubscribeMessage(ClientEvents.LobbyCreate)
	onLobbyCreate(client: AuthenticatedSocket, data: LobbyCreateDto): WsResponse<ServerPayloads[ServerEvents.GameMessage]> {
		console.log("Received event :" + ClientEvents.LobbyCreate);
		const lobby = this.lobbyManager.createLobby(data.mode);
		console.log('Created %s Lobby with id %s', data.mode, lobby.id);
		lobby.addClient(client);

		return {
			event: ServerEvents.GameMessage,
			data: {
				color: 'green',
				message: 'Lobby created',
			},
		};
	}

	@SubscribeMessage(ClientEvents.LobbyJoin)
	onLobbyJoin(client: AuthenticatedSocket, data: LobbyJoinDto): void {
		console.log("Received event :" + ClientEvents.LobbyJoin);
		console.log('Client %s joined lobby %s', client.id, data.lobbyId);
		this.lobbyManager.joinLobby(data.lobbyId, client);
	}

	@SubscribeMessage(ClientEvents.LobbyLeave)
	onLobbyLeave(client: AuthenticatedSocket): void {
		console.log("Received event :" + ClientEvents.LobbyLeave);
		client.data.lobby?.removeClient(client);
	}
}