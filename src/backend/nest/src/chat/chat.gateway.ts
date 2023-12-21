import { SubscribeMessage, WebSocketGateway, MessageBody,  WebSocketServer, OnGatewayConnection, OnGatewayDisconnect,
	ConnectedSocket} from '@nestjs/websockets';
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
import * as jwt from 'jsonwebtoken';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
declare module 'socket.io' {
	export interface Socket {
	  user: any; // Définissez le type approprié pour 'user'
	}
  }

export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
	constructor(private channelService: ChannelService) {}

  @WebSocketServer() server: Server = new Server<
    ServerToClientEvents,
    ClientToServerEvents
  >();
  private logger = new Logger('ChatGateway');

  @SubscribeMessage('remove_admin')
  async delete_admin(
    @MessageBody() payload: addAdminInfo,
	@ConnectedSocket() client: Socket
  ): Promise<void> {
	if (client.user.id !== payload.user.id ) return ; // Securité

    this.logger.log(payload);

	//this.server.to(payload.name).emit('chat', payload)
	await this.channelService.removeAdminToChannel(payload)
  }

  @SubscribeMessage('kick')
  async kick(
    @MessageBody() payload: addAdminInfo,
	@ConnectedSocket() client: Socket
  ): Promise<void> {
	if (client.user.id !== payload.user.id ) return ; // Securité

    this.logger.log(payload);

	//this.server.to(payload.name).emit('chat', payload)

	await this.channelService.kick(payload)
	this.server.to(payload.channel).emit('chat', 
	{
		user: payload.user,
		timeSent: null,
		message: `${payload.new_name} was kicked from ${payload.channel} by ${payload.user.pseudo}`,
		channelName: payload.channel,
	}) 
  }

  @SubscribeMessage('ban')
  async ban(
    @MessageBody() payload: addAdminInfo,
  	@ConnectedSocket() client: Socket
	): Promise<void> {
	if (client.user.id !== payload.user.id ) return ; // Securité

    this.logger.log(payload);

	//this.server.to(payload.name).emit('chat', payload)

	await this.channelService.ban(payload)
	this.server.to(payload.channel).emit('chat', 
	{
		user: payload.user,
		timeSent: null,
		message: `${payload.new_name} was ban from ${payload.channel}  by ${payload.user.pseudo}`,
		channelName: payload.channel,
	}) 
  }

  @SubscribeMessage('mute')
  async mute(
    @MessageBody() payload: addAdminInfo,
  	@ConnectedSocket() client: Socket
	): Promise<void> {
	if (client.user.id !== payload.user.id ) return ; // Securité

    this.logger.log(payload);

	//this.server.to(payload.name).emit('chat', payload)

	await this.channelService.mute(payload)
	this.server.to(payload.channel).emit('chat', 
	{
		user: payload.user,
		timeSent: null,
		message: `${payload.new_name} was mute from ${payload.channel}  by ${payload.user.pseudo} for 2 minutes`,
		channelName: payload.channel,
	}) 
  }

  @SubscribeMessage('add_admin')
  async addAdmin(
    @MessageBody() payload: addAdminInfo,
  	@ConnectedSocket() client: Socket
	): Promise<void> {
	if (client.user.id !== payload.user.id ) return ; // Securité

    this.logger.log(payload);

	//this.server.to(payload.name).emit('chat', payload)
	await this.channelService.addAdminToChannel(payload)
  }

  @SubscribeMessage('invite')
  async handleInvite(
    @MessageBody() payload: InviteToChannel,
  	@ConnectedSocket() client: Socket
	): Promise<void> {
	if (client.user.id !== payload.user.id ) return ; // Securité

    this.logger.log(payload);

	//this.server.to(payload.name).emit('chat', payload)
	await this.channelService.addInviteToChannel(payload)
  }

  @SubscribeMessage('chat')
  async handleEvent(
    @MessageBody() payload: Message,
  	@ConnectedSocket() client: Socket
	): Promise<Message> {
	if (client.user.id !== payload.user.id ) return ; // Securité

    //this.logger.log(payload);
	// Si la personne est mute, on envoie rien
	if (await this.channelService.isMuted(payload)) return payload

	this.server.to(payload.channelName).emit('chat', payload) 
    return payload;
  }

  @SubscribeMessage('join_channel')
  async handleSetClientDataEvent(
    @MessageBody() payload: ChannelCreate,
	@ConnectedSocket() client: Socket
  ): Promise<joinResponse> {
	if (client.user.id !== payload.user.id ) return ; // Securité
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

  @SubscribeMessage('modify_channel')
  async handleModifyChannelEvent(
    @MessageBody() payload: ChannelCreate,
  	@ConnectedSocket() client: Socket
	): Promise<void> {
	if (client.user.id !== payload.user.id ) return ; // Securité

	  if (payload.user.socketId) {
		this.logger.log(`${payload.user.socketId} modified the settings of ${payload.name}`)
		await this.server.in(payload.user.socketId).socketsJoin(payload.name)

		await this.channelService.modifyChannel(payload)
		this.server.to(payload.name).emit('chat', 
		{
			user: payload.user,
			timeSent: null,
			message: `${payload.user.pseudo} modified the settings of ${payload.name}`,
			channelName: payload.name,
		}) 
    }
  }


  async handleConnection(client: Socket): Promise<void> {
	  try {
		  const token = client.handshake.auth.token;
		  // Validez le token ici
		  const payload = jwt.verify(token, 'votre_secret_jwt');
		  client.user = payload;
		  // Si la vérification échoue, une exception sera lancée
		} catch (e) {
		  console.log("je suis sans coeur, je te deco ")
		client.disconnect(); // Déconnectez le client en cas d'échec de la vérification
	  }
    this.logger.log(`Socket connected: ${client.id}`)
  }

  async handleDisconnect(socket: Socket): Promise<void> {
    await this.channelService.removeUserFromAllChannels(socket.id)
    this.logger.log(`Socket disconnected: ${socket.id}`)
  }

}


