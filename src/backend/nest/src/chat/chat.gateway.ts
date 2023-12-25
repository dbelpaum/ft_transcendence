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
  MpChannel,
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

	if (payload.type === "channel")
	{
		if (!await this.channelService.userInChannelBySocketIt(client.id, payload.channelName)) return payload
		this.server.to(payload.channelName).emit('chat', payload) 
	}
	else if (payload.type === "mp")
	{
		const other = this.channelService.getUserByPseudo(payload.channelName)
		if (!other){
			this.server.to(payload.user.socketId).emit("chat", 
			{
				user: payload.user,
				timeSent: null,
				message: `Votre correspondant ${payload.channelName} a quitté la discussion, inutile de lui parler il entends R`,
				channelName: payload.channelName,
				type: "mp"
			})
			return payload
		}
		const mpChannel = this.channelService.findMpChannel(payload.user.id, other.id)
		if (!mpChannel) return payload
		if (mpChannel.user2.socketId === payload.user.socketId)
		{
			this.server.to(mpChannel.user2.socketId).emit('chat', payload) 
			this.server.to(mpChannel.user1.socketId).emit('chat', {...payload, channelName: mpChannel.user2.pseudo})
		}
		else
		{
			this.server.to(mpChannel.user1.socketId).emit('chat', payload) 
			this.server.to(mpChannel.user2.socketId).emit('chat', {...payload, channelName: mpChannel.user1.pseudo})
		}


	}
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
		type: "channel"
	})
	const notif : Notif = 
	{ 
		message: `Vous avez modifé les settings de ${payload.name}`,
		type: "success" 
	}
	this.server.to(client.id).emit('notif',  notif); 
  }

  @SubscribeMessage('mp_create')
  async mp_create(
    @MessageBody() payload: MpChannel,
  	@ConnectedSocket() client: Socket
	): Promise<void> {
		if (client.user.id !== payload.user1.id ) return ; // Securité
		if (!payload.user1.socketId) return 


		this.logger.log(`${payload.user1.pseudo} created mp channel with ${payload.user1.pseudo}`)

		const response = this.channelService.addMpChannel(payload)

		if (response.errorNumber == 0)
		{
			const notif : Notif = 
			{ 
				message: `Nouveau channel de message privé créé avec  ${payload.user2.pseudo}`,
				type: "success" 
			}
			const notif2 : Notif = 
			{ 
				message: `${payload.user1.pseudo} a créé un nouveau channel de messages privés avec vous`,
				type: "success" 
			}
			this.server.to(payload.user1.socketId).emit('notif',  notif); 
			this.server.to(payload.user2.socketId).emit('notif',  notif2); 
			this.server.to(payload.user1.socketId).emit('chat', 
			{
				user: payload.user1,
				timeSent: null,
				message: `Début de votre discussions avec ${payload.user2.pseudo}`,
				channelName: payload.user2.pseudo,
				type: "mp"
			})
			this.server.to(payload.user2.socketId).emit('chat', 
			{
				user: payload.user2,
				timeSent: null,
				message: `Début de votre discussions avec ${payload.user1.pseudo}`,
				channelName: payload.user1.pseudo,
				type: "mp"
			})
		}
		
  }


  async handleConnection(client: Socket): Promise<void> {
	  try {
		  
		  const token = client.handshake.auth.token;
		  // Validez le token ici
		  const payload = jwt.verify(token, 'votre_secret_jwt');
		  client.user = {
			  id: (payload as any).id,
			  id42: (payload as any).id42,
			  pseudo: (payload as any).pseudo,
			  socketId: client.id
			}


		  this.channelService.addConnectedUser(client.user)
		  this.channelService.updateSocketIdInMpChannels(client.user)
		  
		  // Si la vérification échoue, une exception sera lancée
		} catch (e) {
			console.log("client disconnected" + e)
		client.disconnect(); // Déconnectez le client en cas d'échec de la vérification
	  }
    this.logger.log(`Socket connected: ${client.id}`)
  }

  async handleDisconnect(client: Socket): Promise<void> {
    await this.channelService.removeUserFromAllChannels(client.id)
	this.channelService.removeConnectedUser(client.id)
	this.channelService.checkAndRemoveInactiveMpChannels(client.user.id)
	const listOtherMpUserSocket = this.channelService.getSocketIdsInMpChannelsWithUser(client.user.id)
	listOtherMpUserSocket.forEach(socketId => {
		const socket = this.server.sockets.sockets.get(socketId);
		if (socket) {
		  socket.emit("chat", 
			{
				user: client.user,
				timeSent: null,
				message: `Votre correspondant ${client.user.pseudo} a quitté la discussion`,
				channelName: client.user.pseudo,
				type: "mp"
			})
		}
	  });

    this.logger.log(`Socket disconnected: ${client.id}`)
  }

}


