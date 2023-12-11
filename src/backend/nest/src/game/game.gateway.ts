import { SubscribeMessage, WebSocketGateway, WsResponse, OnGatewayConnection } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ServerEvents } from 'src/game/shared/ServerEvents';
import { ClientEvents } from 'src/game/shared/ClientEvents';
import { ServerPayloads } from 'src/game/shared/ServerPayloads';

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