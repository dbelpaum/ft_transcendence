import { SubscribeMessage, WebSocketGateway, WsResponse, OnGatewayConnection } from '@nestjs/websockets';
import { UsePipes } from '@nestjs/common';
import { WsValidationPipe } from 'src/game/validation-pipe';
import { Socket } from 'socket.io';
import { ServerEvents } from 'src/game/shared/server/ServerEvents';
import { ClientEvents } from 'src/game/shared/client/ClientEvents';
import { ServerPayloads } from 'src/game/shared/server/ServerPayloads';

@UsePipes(new WsValidationPipe())
@WebSocketGateway({ namespace: 'game' })
export class GameGateway implements OnGatewayConnection{

	async handleConnection(client: Socket, ...args: any[]): Promise<void>
	{
	  // from here you can verify if the user is authenticated correctly,
	  // you can perform whatever operation (database call, token check, ...) 
	  // you can disconnect client if it didn't match authentication criterias
	  // you can also perform other operations, such as initializing socket attached data 
	  // or whatever you would like upon connection
	}
	
	@SubscribeMessage(ClientEvents.Ping)
	onPing(client: Socket): void {
		client.emit(ServerEvents.Pong, {
			message: 'pong',
		});
	}

	@SubscribeMessage(ClientEvents.LobbyCreate)
	onLobbyCreate(client: Socket): WsResponse<ServerPayloads[ServerEvents.GameMessage]>
	{
		// const lobby = this.lobbyManager.createLobby(data.mode, data.delayBetweenRounds);
		// lobby.addClient(client);
		return {
			event: ServerEvents.GameMessage,
			data: {
				color: 'green',
				message: 'Lobby created',
			},
		};
	}
}