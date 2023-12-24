import { Controller, Get, Param, UseGuards, Request} from '@nestjs/common'
import { Channel, MpChannel, UserTokenInfo } from 'src/chat/chat.interface';
import { ChannelService } from './channel.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('channel')
@UseGuards(AuthGuard('jwt'))
export class ChannelController {
  constructor(private channelService: ChannelService) {}

  @Get('/all')
  async getAllChannels(@Request() req): Promise<Channel[]> {
    return await this.channelService.getAccessibleChannels(req.user.pseudo)
  }

  @Get('/one/:channel')
  async getChannel(@Param() params): Promise<Channel> {
    const channels = await this.channelService.getAllChannels()
    const channel = await this.channelService.getChannelByName(params.channel)
    return channels[channel]
  }

  @Get('/connected/all')
  connected(): UserTokenInfo[] {
    return this.channelService.getAllConnectedUsers()
  }

  @Get('/connected/:id')
  oneconnected(@Param() params): boolean{
    return this.channelService.isUserConnected(+params.id)
  }

  @Get('/mp')
  getMyMps(@Request() req): MpChannel[] {
    return this.channelService.getAllMpChannelsByUser(req.user.id)
  }
}