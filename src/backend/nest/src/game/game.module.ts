import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { LobbyManager } from './lobby/lobby.manager';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [
    // Gateways
    GameGateway,

    // Managers
    LobbyManager,

	PrismaService
  ],
})
export class GameModule
{
}