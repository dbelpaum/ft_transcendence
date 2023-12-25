import { Injectable } from '@nestjs/common';
import {
	Channel,
	ChannelCreate,
	InviteToChannel,
	Message,
	MpChannel,
	User, 
	UserTokenInfo, 
	addAdminInfo, 
	joinResponse} from "../chat/chat.interface"
	import { SubscribeMessage, WebSocketGateway, MessageBody,  WebSocketServer, OnGatewayConnection, OnGatewayDisconnect,
	} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';


@Injectable()
export class ChannelService {
	private channels: Channel[] = []
	private connectedUsers: UserTokenInfo[] = []
	private mpChannel : MpChannel[] = []
  

	checkAndRemoveInactiveMpChannels(userId: number): void {
		this.mpChannel = this.mpChannel.filter(mpChannel => {
		  if (mpChannel.user1.id === userId || mpChannel.user2.id === userId) {
			if (this.isUserConnected(mpChannel.user1.id)) return true
			if (this.isUserConnected(mpChannel.user2.id)) return true
			return false
		  }
		  return true;
		});
	}

	getSocketIdsInMpChannelsWithUser(userId: number): string[] {
		let socketIds: string[] = [];
	
		this.mpChannel.forEach(mpChannel => {
		  if (mpChannel.user1.id === userId && mpChannel.user2?.socketId) {
			socketIds.push(mpChannel.user2.socketId);
		  } else if (mpChannel.user2.id === userId && mpChannel.user1?.socketId) {
			socketIds.push(mpChannel.user1.socketId);
		  }
		});
	
		return socketIds;
	  }
	

	
	removeMpChannelIfInactive(mpChannel: MpChannel): void {
		const user1Connected = this.isUserConnected(mpChannel.user1.id);
		const user2Connected = this.isUserConnected(mpChannel.user2.id);

		if (!user1Connected && !user2Connected) {
			const index = this.mpChannel.indexOf(mpChannel);
			if (index !== -1) {
			this.mpChannel.splice(index, 1);
			}
		}
	}
	
	getUserByPseudo(pseudo: string): User | undefined {
		const user = this.connectedUsers.find(u => u.pseudo === pseudo);
		return user ? user : undefined;
	}

	getUserPseudoByID(userID: number): string | undefined {
		const user = this.connectedUsers.find(u => u.id === userID);
		return user ? user.pseudo : undefined;
	}
	
	
	addMpChannel(mpChannelCreate: MpChannel): joinResponse {
		const mpChannelExists = this.mpChannel.some(mp => 
			(mp.user1.id === mpChannelCreate.user1.id && mp.user2.id === mpChannelCreate.user2.id) ||
			(mp.user1.id === mpChannelCreate.user2.id && mp.user2.id === mpChannelCreate.user1.id)
		);
		
		if (!mpChannelExists) {
			this.mpChannel.push(mpChannelCreate);
			return {
				errorNumber: 0,
				text: `Nouveau channel créé`
			};
		}
		return {
			errorNumber: 1,
			text: `Le channel existe deja`
		};
	}

	updateSocketIdInMpChannels(updatedUser: UserTokenInfo): void {
		this.mpChannel.forEach(mpChannel => {
		  if (mpChannel.user1.id === updatedUser.id) {
			mpChannel.user1.socketId = updatedUser.socketId;
		  }
		  if (mpChannel.user2.id === updatedUser.id) {
			mpChannel.user2.socketId = updatedUser.socketId;
		  }
		});
	  }

	removeMpChannel(user1Id: number, user2Id: number): void {
		this.mpChannel = this.mpChannel.filter(mp => 
			!(mp.user1.id === user1Id && mp.user2.id === user2Id) &&
			!(mp.user1.id === user2Id && mp.user2.id === user1Id)
		);
	}

	removeAllMpChannelOfUser(userId: number): void {
		this.mpChannel = this.mpChannel.filter(mp => 
			(mp.user1.id !== userId) && (mp.user2.id !== userId) 
		);
	}
	

	findMpChannel(user1Id: number, user2Id: number): MpChannel | undefined {
		return this.mpChannel.find(mp => 
		  (mp.user1.id === user1Id && mp.user2.id === user2Id) ||
		  (mp.user1.id === user2Id && mp.user2.id === user1Id)
		);
	}
	  
	getAllMpChannelsByUser(userId: number): MpChannel[]
	{
		return this.mpChannel.filter(mp => mp.user1.id === userId || mp.user2.id === userId);
	}

	mpChannelExists(user1Id: number, user2Id: number): boolean {
		return this.mpChannel.some(mp => 
		  (mp.user1.id === user1Id && mp.user2.id === user2Id) ||
		  (mp.user1.id === user2Id && mp.user2.id === user1Id)
		);
	  }
	  

	  
	addConnectedUser(user: UserTokenInfo): void {
		const userExists = this.connectedUsers.some(u => u.id === user.id);
		if (!userExists) {
			this.connectedUsers.push(user);
		}
	}
	  
	removeConnectedUser(userId: number): void {
		this.connectedUsers = this.connectedUsers.filter(u => u.id !== userId);
	}

	isUserConnected(userId: number): boolean {
		return this.connectedUsers.some(u => u.id === userId);
	}
	  
	getConnectedUserById(userId: number): UserTokenInfo | undefined {
		return this.connectedUsers.find(u => u.id === userId);
	}

	getConnectedUserById42(userId42: number): UserTokenInfo | undefined {
		return this.connectedUsers.find(u => u.id42 === userId42);
	}

	getConnectedUserByPseudo(pseudo: string): UserTokenInfo | undefined {
		return this.connectedUsers.find(u => u.pseudo === pseudo);
	}

	getAllConnectedUsers(): UserTokenInfo[] {
		return this.connectedUsers;
	}
	  
	  

	async addChannel(channelCreate: ChannelCreate): Promise<void> {
	  const channel = await this.getChannelByName(channelCreate.name)
	  if (channel === -1) {
		await this.channels.push(
			{ 
				name: channelCreate.name, 
				host: [channelCreate.user.pseudo],
				owner: channelCreate.user,
				users: [channelCreate.user],
				type: channelCreate.type,
				mdp: channelCreate.mdp,
				invited: [channelCreate.user.pseudo],
				ban: [],
				mute: []
			})
	  }
	}

  
	async removeChannel(channelName: string): Promise<void> {
	  const findChannel = await this.getChannelByName(channelName)
	  if (findChannel !== -1) {
		this.channels = this.channels.filter((channel) => channel.name !== channelName)
	  }
	}
  
	async getChannelHost(hostName: string): Promise<string[]> {
	  const channelIndex = await this.getChannelByName(hostName)
	  return this.channels[channelIndex].host
	}
  
	async getChannelByName(channelName: string): Promise<number> {
	  const channelIndex = this.channels.findIndex((channel) => channel?.name === channelName)
	  return channelIndex
	}

	userIsInvited(pseudo: string, channel: Channel): boolean {
		return channel.invited.some(l => l === pseudo)
	}

	mdpIsValid(mdp: string, channel: Channel): boolean {
		return (mdp === channel.mdp)
	}

	userIsHost(user_pseudo: string, channel: Channel)
	{
		return channel.host.some(l => l == user_pseudo)
	}

	async addInviteToChannel(inviteInfo: InviteToChannel) : Promise<void>
	{
		// Si le channel existe pas, on ne fait rien
		const channelIndex = await this.getChannelByName(inviteInfo.channel_name)
		if (channelIndex === -1) return;


		// Si l'utilisateur n'est pas administrateur, on ne fait rien
		if (!this.userIsHost(inviteInfo.user.pseudo,this.channels[channelIndex])) return

		// Sinon, on ajoute le nom a la liste des invités
		this.channels[channelIndex].invited.push(inviteInfo.invited_name)

	}

	async addAdminToChannel(adminInfo: addAdminInfo) : Promise<void>
	{
		// Si le channel existe pas, on ne fait rien
		const channelIndex = await this.getChannelByName(adminInfo.channel)
		if (channelIndex === -1) return;


		// Si l'utilisateur n'est pas administrateur, on ne fait rien
		if (!this.userIsHost(adminInfo.user.pseudo,this.channels[channelIndex])) return

		// Sinon, on ajoute le nom a la liste des admins
		this.channels[channelIndex].host.push(adminInfo.user_to_modify.pseudo)

	}

	async removeAdminToChannel(adminInfo: addAdminInfo) : Promise<boolean>
	{
		// Si le channel existe pas, on ne fait rien
		const channelIndex = await this.getChannelByName(adminInfo.channel)
		if (channelIndex === -1) return false;


		// Si l'utilisateur n'est pas administrateur, on ne fait rien
		if (!this.userIsHost(adminInfo.user.pseudo,this.channels[channelIndex])) return false

		// Si l'utilisateur a supprimer des admins est nous meme, on ne fait rien
		if (adminInfo.user_to_modify.pseudo === adminInfo.user.pseudo) return false

		// Si l'utilisateur a ban est le channel owener, on ne fait rien
		if (adminInfo.user_to_modify.socketId === this.channels[channelIndex].owner.socketId) return false 

		// Sinon, on enleve le nom a la liste des admins

		const adminIndex = this.channels[channelIndex].host.indexOf(adminInfo.user_to_modify.pseudo);
		if (adminIndex !== -1) {
			this.channels[channelIndex].host.splice(adminIndex, 1);
		}
		return true
	}

	async kick(adminInfo: addAdminInfo) : Promise<boolean>
	{
		// Si le channel existe pas, on ne fait rien
		const channelIndex = await this.getChannelByName(adminInfo.channel)
		if (channelIndex === -1) return false;

		// Si l'utilisateur n'est pas administrateur, on ne fait rien
		if (!this.userIsHost(adminInfo.user.pseudo,this.channels[channelIndex])) return false

		// Si l'utilisateur a kick est nous meme, on ne fait rien
		if (adminInfo.user_to_modify.pseudo === adminInfo.user.pseudo) return false

		// Si l'utilisateur a ban est le channel owener, on ne fait rien
		if (adminInfo.user_to_modify.socketId === this.channels[channelIndex].owner.socketId) return false


		// Sinon, on supprime la personne de la liste des users
		this.channels[channelIndex].users = this.channels[channelIndex].users.filter(user => user.pseudo !== adminInfo.user_to_modify.pseudo);
		this.channels[channelIndex].host = this.channels[channelIndex].host.filter(pseudo => pseudo !== adminInfo.user_to_modify.pseudo);
		return true
	}
  
	async ban(adminInfo: addAdminInfo) : Promise<boolean>
	{
		// Si le channel existe pas, on ne fait rien
		const channelIndex = await this.getChannelByName(adminInfo.channel)
		if (channelIndex === -1) return false;


		// Si l'utilisateur n'est pas administrateur, on ne fait rien
		if (!this.userIsHost(adminInfo.user.pseudo,this.channels[channelIndex])) return false

		// Si l'utilisateur a ban est nous meme, on ne fait rien
		if (adminInfo.user_to_modify.pseudo === adminInfo.user.pseudo) return false

		// Si l'utilisateur a ban est le channel owener, on ne fait rien
		if (adminInfo.user_to_modify.socketId === this.channels[channelIndex].owner.socketId) return false 


		// Sinon, on ajoute la personne de la liste des bannis
		this.channels[channelIndex].ban.push(adminInfo.user_to_modify.pseudo)

		// puis on supprime la personne de la liste des users
		this.channels[channelIndex].users = this.channels[channelIndex].users.filter(user => user.pseudo !== adminInfo.user_to_modify.pseudo);
		this.channels[channelIndex].host = this.channels[channelIndex].host.filter(pseudo => pseudo !== adminInfo.user_to_modify.pseudo);

		
		return true
	}

	async mute(adminInfo: addAdminInfo): Promise<boolean> {
		// Si le channel existe pas, on ne fait rien
		const channelIndex = await this.getChannelByName(adminInfo.channel)
		if (channelIndex === -1) return false;


		// Si l'utilisateur n'est pas administrateur, on ne fait rien
		if (!this.userIsHost(adminInfo.user.pseudo,this.channels[channelIndex])) return false

		// Si l'utilisateur a ban est nous meme, on ne fait rien
		if (adminInfo.user_to_modify.pseudo === adminInfo.user.pseudo) return false

		// Si l'utilisateur a ban est le channel owener, on ne fait rien
		if (adminInfo.user_to_modify.socketId === this.channels[channelIndex].owner.socketId) return false 


		this.channels[channelIndex].mute.push(adminInfo.user_to_modify.pseudo);
	
		// Minuterie pour démuter automatiquement après 120 secondes
		setTimeout(() => {
			this.channels[channelIndex].mute = this.channels[channelIndex].mute.filter(m => m !== adminInfo.user_to_modify.pseudo);
		}, 120000);

		return true
	  }

	  async isMuted(message: Message): Promise<boolean> {
		// Si le channel existe pas, on ne fait rien
		const channelIndex = await this.getChannelByName(message.channelName)
		if (channelIndex === -1) return;

		// On return true si l'utilisateur est dans la liste des muted
		return this.channels[channelIndex].mute.some(muted => muted === message.user.pseudo)
	  }

	async modifyChannel(channelCreate: ChannelCreate): Promise<void> {
		if (!this.typeIsValid(channelCreate.type)){
			return 
		}
		// Si le channel existe pas, on ne fait rien
		const channelIndex = await this.getChannelByName(channelCreate.name)
		if (channelIndex === -1) return;

		// Si l'utilisateur n'est pas owner, on ne fait rien
		if (channelCreate.user.pseudo !== this.channels[channelIndex].owner.pseudo) return
		
		// Sinon, on peut modifier les informations du channel
		this.channels[channelIndex].type = channelCreate.type
		this.channels[channelIndex].mdp = channelCreate.mdp
	}
	  
	typeIsValid(type:string) : boolean
	{
		if (type == "private") return true
		if (type == "public") return true
		if (type == "protected") return true
		return false
	}

	async addUserToChannel(channelCreate: ChannelCreate): Promise<joinResponse> {

		if (!this.typeIsValid(channelCreate.type)){
			return {
				errorNumber: 10,
				text: "Le type du channel n'est pas ok " + channelCreate.type
			}
		}
		// Si le channel existe
		const channelIndex = await this.getChannelByName(channelCreate.name)
		if (channelIndex !== -1) {
			// Si l'utilisateur est déja dans le channel, inutile de l'invité
			if (this.channels[channelIndex].users.some(user => user.socketId === channelCreate.user.socketId))
			{
				return {
					errorNumber: 25,
					text: `Vous essayez de creer ou rejoindre un channel alors que vous etes deja dedans ${this.channels[channelIndex].name}`
				};
			}

			// Si l'utilisateur est ban, qu'il le reste
			if (this.channels[channelIndex].ban.some(name => name === channelCreate.user.pseudo))
			{
				return {
					errorNumber: 26,
					text: "Vous essayez de rejoindre un channel alors que vous avez été ban : " + this.channels[channelIndex].name
				};
			}


			// Si le channel est private et qu'on est pas dans les invité, on ne rentre pas
			if (this.channels[channelIndex].type === "private")
			{
				if (!this.userIsInvited(channelCreate.user.pseudo, this.channels[channelIndex]))
				{
					return {
						errorNumber: 20,
						text: "Vous essayez de rejoindre un channel privé sans avoir été invité : " + this.channels[channelIndex].name
					};

				}
			}
			// Si le channel est protected et que le mdp est pas ok, on ne rentre pqs
			if (this.channels[channelIndex].type === "protected")
			{
				if (!this.mdpIsValid(channelCreate.mdp, this.channels[channelIndex]))
				{
					return {
						errorNumber: 21,
						text: "Vous essayez de rejoindre un channel privé avec le mauvais mdp: " + this.channels[channelIndex].name
					};

				}
			}
				// Dans tout les autres cas, on ajoute l'utilisateur
			this.channels[channelIndex].users.push(channelCreate.user)
			this.channels[channelIndex].invited.push(channelCreate.user.pseudo)
			return {
				errorNumber: 0,
				text: `Vous avez rejoint le channel ${this.channels[channelIndex].name}`
			};
		}
		// Si le channel existe pas, on le créé
		await this.addChannel(channelCreate)
		return {
			errorNumber: 0,
			text: "Nouveau channel créé"
		};
	}
  

	async findChannelsByUserSocketId(socketId: string): Promise<Channel[]> {
	  const filteredChannels = this.channels.filter((channel) => {
		const found = channel.users.find((user) => user.socketId === socketId)
		if (found) {
		  return found
		}
	  })
	  return filteredChannels
	}
  
	async removeUserFromAllChannels(socketId: string): Promise<void> {
	  const channels = await this.findChannelsByUserSocketId(socketId)
	  for (const channel of channels) {
		await this.removeUserFromChannel(socketId, channel.name)
	  }
	}
  
	async removeUserFromChannel(socketId: string, channelName: string): Promise<void> {
	  const channel = await this.getChannelByName(channelName)
	  if (this.channels[channel])
	  {
		  this.channels[channel].users = this.channels[channel].users.filter((user) => user.socketId !== socketId)
		  if (this.channels[channel].users.length === 0) {
			await this.removeChannel(channelName)
		  }
	  }

	}

	async getAllChannels(): Promise<Channel[]> {
		return this.channels
	  }
  
	async getAccessibleChannels(pseudo: string): Promise<Channel[]> {
	  return this.channels.filter(c => c.type !== "private" || this.userIsInvited(pseudo, c))
	}
  }
  