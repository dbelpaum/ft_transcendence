import { Controller, Get, Param } from '@nestjs/common'
import { Channel } from 'src/chat/chat.interface';
import { ChannelService } from './channel.service';

@Controller('channel')
export class ChannelController {
  constructor(private channelService: ChannelService) {}

  @Get('/all/:user')
  async getAllChannels(@Param() params): Promise<Channel[]> {
    return await this.channelService.getAccessibleChannels(params.user)
  }

  @Get('/one/:channel')
  async getChannel(@Param() params): Promise<Channel> {
    const channels = await this.channelService.getAllChannels()
    const channel = await this.channelService.getChannelByName(params.channel)
    return channels[channel]
  }
}