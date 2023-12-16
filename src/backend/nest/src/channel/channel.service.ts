import { Injectable } from '@nestjs/common';
import {
	Channel,
	ChannelCreate,
	InviteToChannel,
	User, 
	addAdminInfo, 
	joinResponse} from "../chat/chat.interface"
	import { SubscribeMessage, WebSocketGateway, MessageBody,  WebSocketServer, OnGatewayConnection, OnGatewayDisconnect,
	} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';


@Injectable()
export class ChannelService {
	private channels: Channel[] = []
  
	async addChannel(channelCreate: ChannelCreate): Promise<void> {
	  const channel = await this.getChannelByName(channelCreate.name)
	  if (channel === -1) {
		await this.channels.push(
			{ 
				name: channelCreate.name, 
				host: [channelCreate.user.login],
				owner: channelCreate.user,
				users: [channelCreate.user],
				type: channelCreate.type,
				mdp: channelCreate.mdp,
				invited: [channelCreate.user.login]
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

	userIsInvited(login: string, channel: Channel): boolean {
		return channel.invited.some(l => l === login)
	}

	mdpIsValid(mdp: string, channel: Channel): boolean {
		return (mdp === channel.mdp)
	}

	userIsHost(user_login: string, channel: Channel)
	{
		return channel.host.some(l => l == user_login)
	}

	async addInviteToChannel(inviteInfo: InviteToChannel) : Promise<void>
	{
		// Si le channel existe pas, on ne fait rien
		const channelIndex = await this.getChannelByName(inviteInfo.channel_name)
		if (channelIndex === -1) return;


		// Si l'utilisateur n'est pas administrateur, on ne fait rien
		if (!this.userIsHost(inviteInfo.user.login,this.channels[channelIndex])) return

		// Sinon, on ajoute le nom a la liste des invités
		this.channels[channelIndex].invited.push(inviteInfo.invited_name)

	}

	async addAdminToChannel(adminInfo: addAdminInfo) : Promise<void>
	{
		// Si le channel existe pas, on ne fait rien
		const channelIndex = await this.getChannelByName(adminInfo.channel)
		if (channelIndex === -1) return;


		// Si l'utilisateur n'est pas administrateur, on ne fait rien
		if (!this.userIsHost(adminInfo.user.login,this.channels[channelIndex])) return

		// Sinon, on ajoute le nom a la liste des admins
		this.channels[channelIndex].host.push(adminInfo.new_admin_name)

	}

	async removeAdminToChannel(adminInfo: addAdminInfo) : Promise<void>
	{
		// Si le channel existe pas, on ne fait rien
		const channelIndex = await this.getChannelByName(adminInfo.channel)
		if (channelIndex === -1) return;


		// Si l'utilisateur n'est pas administrateur, on ne fait rien
		if (!this.userIsHost(adminInfo.user.login,this.channels[channelIndex])) return

		// Si l'utilisateur a supprimer des admins est nous meme, on ne fait rien
		if (adminInfo.new_admin_name === adminInfo.user.login) return

		// Sinon, on ajoute le nom a la liste des admins

		const adminIndex = this.channels[channelIndex].host.indexOf(adminInfo.new_admin_name);
		if (adminIndex !== -1) {
			this.channels[channelIndex].host.splice(adminIndex, 1);
		}


	}
  
	async addUserToChannel(channelCreate: ChannelCreate): Promise<joinResponse> {

		// Si le channel existe
		const channelIndex = await this.getChannelByName(channelCreate.name)
		if (channelIndex !== -1) {
			// Si le channel est private et qu'on est pas dans les invité, on ne rentre pas
			if (this.channels[channelIndex].type === "private")
			{
				if (!this.userIsInvited(channelCreate.user.login, this.channels[channelIndex]))
				{
					return {
						errorNumber: 20,
						text: "L'utilisateur " + channelCreate.user.login + " essaie de rejoindre un channel privé sans avoir été invité : " + this.channels[channelIndex].name
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
						text: "L'utilisateur " + channelCreate.user.login + " essaie de rejoindre un channel privé avec le mauvais mdp: " + this.channels[channelIndex].name
					};

				}
			}
				// Dans tout les autres cas, on ajoute l'utilisateur
			this.channels[channelIndex].users.push(channelCreate.user)
			return {
				errorNumber: 0,
				text: "Utilisateur ajouté dans le channel"
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
  
	async getAccessibleChannels(login: string): Promise<Channel[]> {
	  return this.channels.filter(c => c.type !== "private" || this.userIsInvited(login, c))
	}
  }
  