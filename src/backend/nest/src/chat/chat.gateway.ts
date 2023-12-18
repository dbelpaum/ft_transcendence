import { SubscribeMessage, WebSocketGateway, MessageBody,  WebSocketServer, OnGatewayConnection, OnGatewayDisconnect,
  } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import {
  ServerToClientEvents,
  ClientToServerEvents,
  Message,
  User,
  ChannelCreate,
  joinResponse,
  Channel,
  InviteToChannel,
  addAdminInfo,
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

  @SubscribeMessage('remove_admin')
  async delete_admin(
    @MessageBody()
    payload: addAdminInfo,
  ): Promise<void> {
    this.logger.log(payload);

	//this.server.to(payload.name).emit('chat', payload)
	await this.channelService.removeAdminToChannel(payload)
  }

  @SubscribeMessage('add_admin')
  async addAdmin(
    @MessageBody()
    payload: addAdminInfo,
  ): Promise<void> {
    this.logger.log(payload);

	//this.server.to(payload.name).emit('chat', payload)
	await this.channelService.addAdminToChannel(payload)
  }

  @SubscribeMessage('invite')
  async handleInvite(
    @MessageBody()
    payload: InviteToChannel,
  ): Promise<void> {
    this.logger.log(payload);

	//this.server.to(payload.name).emit('chat', payload)
	await this.channelService.addInviteToChannel(payload)
  }

  @SubscribeMessage('chat')
  async handleEvent(
    @MessageBody()
    payload: Message,
  ): Promise<Message> {
    this.logger.log(payload);
	this.server.to(payload.channelName).emit('chat', payload) 
    return payload;
  }

  @SubscribeMessage('join_channel')
  async handleSetClientDataEvent(
    @MessageBody()
    payload: ChannelCreate
  ): Promise<joinResponse> {
	  if (payload.user.socketId) {
		this.logger.log(`${payload.user.socketId} is joining ${payload.name}`)
		await this.server.in(payload.user.socketId).socketsJoin(payload.name)

		const response =  await this.channelService.addUserToChannel(payload)
		if (response.errorNumber === 0)
		{
			this.server.to(payload.name).emit('chat', 
			{
				user: payload.user,
				timeSent: null,
				message: `${payload.user.pseudo} jump in ${payload.name}`,
				channelName: payload.name,
			}) 
		}
		return response
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


