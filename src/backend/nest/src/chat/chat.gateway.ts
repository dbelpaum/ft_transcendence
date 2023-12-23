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
  Notif,
  UserTokenInfo,
} from './chat.interface';
import { Server, Socket } from 'socket.io';
import { ChannelService } from 'src/channel/channel.service';
import * as jwt from 'jsonwebtoken';


declare module 'socket.io' {
	export interface Socket {
		user: UserTokenInfo
	}
  }


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
    @MessageBody() payload: addAdminInfo,
	@ConnectedSocket() client: Socket
  ): Promise<void> {
	if (client.user.id !== payload.user.id ) return ; // Securité

    this.logger.log(payload);

	//this.server.to(payload.name).emit('chat', payload)
	await this.channelService.removeAdminToChannel(payload)

	const notifKicker : Notif = 
	{ 
		message: `${payload.user_to_modify.pseudo} is not admin anymore of ${payload.channel}`,
		type: "success" 
	}
	const notifVictim : Notif = 
	{ 
		message: `You are not admin anymore in ${payload.channel}`,
		type: "warning" 
	}
	this.server.to(client.id).emit('notif',  notifKicker);
	this.server.to(payload.user_to_modify.socketId).emit('notif',  notifVictim);
  }

  @SubscribeMessage('kick')
  async kick(
    @MessageBody() payload: addAdminInfo,
	@ConnectedSocket() client: Socket
  ): Promise<void> {
	if (client.user.id !== payload.user.id ) return ; // Securité

    //this.logger.log(payload);

	//this.server.to(payload.name).emit('chat', payload)

	if (!await this.channelService.kick(payload)) return
	await this.server.in(payload.user.socketId).socketsLeave(payload.user_to_modify.pseudo);
	this.server.to(payload.channel).emit('chat', 
	{
		user: payload.user,
		timeSent: null,
		message: `${payload.user_to_modify.pseudo} was kicked from ${payload.channel} by ${payload.user.pseudo}`,
		channelName: payload.channel,
	})
	const notifKicker : Notif = 
	{ 
		message: `You kicked ${payload.user_to_modify.pseudo} from ${payload.channel}`,
		type: "success" 
	}
	const notifVictim : Notif = 
	{ 
		message: `${payload.user.pseudo} kicked you from ${payload.channel}`,
		type: "warning" 
	}
	this.server.to(client.id).emit('notif',  notifKicker);
	this.server.to(payload.user_to_modify.socketId).emit('notif',  notifVictim);
	
	console.log(notifKicker)
  }

  @SubscribeMessage('ban')
  async ban(
    @MessageBody() payload: addAdminInfo,
  	@ConnectedSocket() client: Socket
	): Promise<void> {
	if (client.user.id !== payload.user.id ) return ; // Securité

    this.logger.log(payload);

	//this.server.to(payload.name).emit('chat', payload)

	if (!await this.channelService.ban(payload)) return
	await this.server.in(payload.user.socketId).socketsLeave(payload.user_to_modify.pseudo);
	this.server.to(payload.channel).emit('chat', 
	{
		user: payload.user,
		timeSent: null,
		message: `${payload.user_to_modify.pseudo} was ban from ${payload.channel}  by ${payload.user.pseudo}`,
		channelName: payload.channel,
	})

	const notif : Notif = 
	{ 
		message: `You banned ${payload.user_to_modify.pseudo} from ${payload.channel}`,
		type: "success" 
	}
	const notifVictim : Notif = 
	{ 
		message: `${payload.user.pseudo} banned you from ${payload.channel}`,
		type: "warning" 
	}
	this.server.to(client.id).emit('notif',  notif);
	this.server.to(payload.user_to_modify.socketId).emit('notif',  notifVictim);
  }

  @SubscribeMessage('mute')
  async mute(
    @MessageBody() payload: addAdminInfo,
  	@ConnectedSocket() client: Socket
	): Promise<void> {
	if (client.user.id !== payload.user.id ) return ; // Securité

    this.logger.log(payload);

	//this.server.to(payload.name).emit('chat', payload)

	if (!await this.channelService.mute(payload)) return
	this.server.to(payload.channel).emit('chat', 
	{
		user: payload.user,
		timeSent: null,
		message: `${payload.user_to_modify.pseudo} was mute from ${payload.channel}  by ${payload.user.pseudo} for 2 minutes`,
		channelName: payload.channel,
	})

	const notif : Notif = 
	{ 
		message: `You muted ${payload.user_to_modify.pseudo} from ${payload.channel} for 2 minutes`,
		type: "success" 
	}
	const notifVictim : Notif = 
	{ 
		message: `${payload.user.pseudo} muted you from ${payload.channel} for 2 minutes`,
		type: "warning" 
	}
	this.server.to(client.id).emit('notif',  notif);
	this.server.to(payload.user_to_modify.socketId).emit('notif',  notifVictim);
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

	const notif : Notif = 
	{ 
		message: `${payload.user_to_modify.pseudo} is now admin of ${payload.channel}`,
		type: "success" 
	}
	const notifVictim : Notif = 
	{ 
		message: `${payload.user.pseudo} make you an admin of ${payload.channel}`,
		type: "success" 
	}
	this.server.to(client.id).emit('notif',  notif);
	this.server.to(payload.user_to_modify.socketId).emit('notif',  notifVictim);
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
	const notif : Notif = 
	{ 
		message: `You invited ${payload.invited_name} in ${payload.channel_name}`,
		type: "success" 
	}
	const notifVictim : Notif = 
	{ 
		message: `${payload.user.pseudo} invited you in ${payload.channel_name}`,
		type: "warning" 
	}
	this.server.to(client.id).emit('notif',  notif);
	const invitedUser = this.channelService.getConnectedUserByPseudo(payload.invited_name)
	if (invitedUser)
	{
		this.server.to(invitedUser.socketId).emit('notif',  notifVictim);
	}
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
	if (!payload.user.socketId) return
	this.logger.log(`${payload.user.socketId} is joining ${payload.name}`)
	

	const response =  await this.channelService.addUserToChannel(payload)
	var notif : Notif
	if (response.errorNumber === 0)
	{
		await this.server.in(payload.user.socketId).socketsJoin(payload.name)
		this.server.to(payload.name).emit('chat', 
		{
			user: payload.user,
			timeSent: null,
			message: `${payload.user.pseudo} jump in ${payload.name}`,
			channelName: payload.name,
		})
		notif = 
		{ 
			message: `${response.text}`,
			type: "success" 
		}
	}
	else
	{
		notif  = 
		{ 
			message: `${response.text}`,
			type: "warning" 
		}
		
	}
	this.server.to(client.id).emit('notif',  notif);


	return response
}
  

  @SubscribeMessage('modify_channel')
  async handleModifyChannelEvent(
    @MessageBody() payload: ChannelCreate,
  	@ConnectedSocket() client: Socket
	): Promise<void> {
	if (client.user.id !== payload.user.id ) return ; // Securité
	if (!payload.user.socketId) return 

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
	const notif : Notif = 
	{ 
		message: `Vous avez modifé les settings de ${payload.name}`,
		type: "success" 
	}
	this.server.to(client.id).emit('notif',  notif);
    
  }


  async handleConnection(client: Socket): Promise<void> {
	  try {
		  const token = client.handshake.auth.token;
		  // Validez le token ici
		  const payload = jwt.verify(token, 'votre_secret_jwt');
		  client.user = {
			id: payload.id,
			id42: payload.id42,
			pseudo: payload.pseudo,
			socketId: client.id
		  }


		  this.channelService.addConnectedUser(client.user)
		  // Si la vérification échoue, une exception sera lancée
		} catch (e) {
		client.disconnect(); // Déconnectez le client en cas d'échec de la vérification
	  }
    this.logger.log(`Socket connected: ${client.id}`)
  }

  async handleDisconnect(client: Socket): Promise<void> {
    await this.channelService.removeUserFromAllChannels(client.id)
	this.channelService.removeConnectedUser(client.user.id)
    this.logger.log(`Socket disconnected: ${client.id}`)
  }

}


