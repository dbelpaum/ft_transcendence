import { SubscribeMessage, WebSocketGateway, MessageBody,  WebSocketServer, OnGatewayConnection, OnGatewayDisconnect,
  } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import {
  ServerToClientEvents,
  ClientToServerEvents,
  Message,
  User
} from './chat.interface';
import { Server, Socket } from 'socket.io';
import { ChannelService } from 'src/channel/channel.service';


@WebSocketGateway({
  cors: {
    origin: '*',
  },
})

export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
	constructor(private channelService: ChannelService) {}

  @WebSocketServer() server: Server = new Server<
    ServerToClientEvents,
    ClientToServerEvents
  >();
  private logger = new Logger('ChatGateway');

  @SubscribeMessage('chat')
  async handleEvent(
    @MessageBody()
    payload: Message,
  ): Promise<Message> {
    this.logger.log(payload);
	console.log(payload)
	//this.server.to(payload.name).emit('chat', payload)
    return payload;
  }

  @SubscribeMessage('join_channel')
  async handleSetClientDataEvent(
    @MessageBody()
    payload: {
      name: string
      user: User
    }
  ) {
	  if (payload.user.socketId) {
      this.logger.log(`${payload.user.socketId} is joining ${payload.name}`)
      await this.server.in(payload.user.socketId).socketsJoin(payload.name)
      await this.channelService.addUserToChannel(payload.name, payload.user)
    }
  }

  async handleConnection(socket: Socket): Promise<void> {
    this.logger.log(`Socket connected: ${socket.id}`)
  }

  async handleDisconnect(socket: Socket): Promise<void> {
    await this.channelService.removeUserFromAllChannels(socket.id)
    this.logger.log(`Socket disconnected: ${socket.id}`)
  }

}


