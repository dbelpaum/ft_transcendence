import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';

@Module({
  providers: [ChannelService],
  exports: [ChannelService],
  controllers: [ChannelController]
})
export class ChannelModule {}

