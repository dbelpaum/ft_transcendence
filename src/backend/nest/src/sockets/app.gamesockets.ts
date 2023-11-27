// import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
// import { Server } from 'socket.io';

// @WebSocketGateway()
// export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
//   @WebSocketServer() server: Server;

//   handleConnection(client: any, ...args: any[]) {
//     // Handle new client connection
//   }

//   handleDisconnect(client: any) {
//     // Handle client disconnection
//   }

//   @SubscribeMessage('move')
//   handleMove(client: any, data: { direction: string }) {
//     // Handle player move event
//     // Update game state and broadcast to all clients
//     this.server.emit('state', updatedGameState);
//   }
// }