import { Controller, Get, Param } from '@nestjs/common'
import { Channel } from 'src/chat/chat.interface';
import { ChannelService } from './channel.service';

@Controller('channel')
export class ChannelController {
  constructor(private channelService: ChannelService) {}

  @Get('/all')
  async getAllChannels(): Promise<Channel[]> {
    return await this.channelService.getChannels()
  }

  @Get('/one/:channel')
  async getChannel(@Param() params): Promise<Channel> {
    const channels = await this.channelService.getChannels()
    const channel = await this.channelService.getChannelByName(params.channel)
    return channels[channel]
  }
}