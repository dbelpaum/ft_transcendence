import { Injectable } from '@nestjs/common';
import {
	Channel,
	User } from "../chat/chat.interface"

@Injectable()
export class ChannelService {
	private channels: Channel[] = []
  
	async addChannel(channelName: string, host: User): Promise<void> {
	  const channel = await this.getChannelByName(channelName)
	  if (channel === -1) {
		await this.channels.push({ name: channelName, host: [host], users: [host] })
	  }
	}
  
	async removeChannel(channelName: string): Promise<void> {
	  const findChannel = await this.getChannelByName(channelName)
	  if (findChannel !== -1) {
		this.channels = this.channels.filter((channel) => channel.name !== channelName)
	  }
	}
  
	async getChannelHost(hostName: string): Promise<User[]> {
	  const channelIndex = await this.getChannelByName(hostName)
	  return this.channels[channelIndex].host
	}
  
	async getChannelByName(channelName: string): Promise<number> {
	  const channelIndex = this.channels.findIndex((channel) => channel?.name === channelName)
	  return channelIndex
	}
  
	async addUserToChannel(channelName: string, user: User): Promise<void> {
	  const channelIndex = await this.getChannelByName(channelName)
	  if (channelIndex !== -1) {
		this.channels[channelIndex].users.push(user)
		}
		else
		{
			await this.addChannel(channelName, user)

		}
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
  
	async getChannels(): Promise<Channel[]> {
	  return this.channels
	}
  }
  