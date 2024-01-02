import { Module ,NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SamTestController } from './sam-test/sam-test.controller';
import { PrismaService } from './prisma.service';
import { AuthentificationModule } from './authentification/authentification.module';
import { ChatModule } from './chat/chat.module';

import { ChannelModule } from './channel/channel.module';
import { LogoutController } from './logout/logout.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { UserController } from './user/user.controller';
import * as session from 'express-session';
import { GameModule } from './game/game.module';
import { FriendshipController } from './friendship/friendship.controller';
import { ScoreController } from './score/score.controller';

@Module({
  imports: [AuthentificationModule, ChatModule, ChannelModule, ScheduleModule.forRoot(), GameModule],
  controllers: [AppController, SamTestController, LogoutController, UserController, FriendshipController, ScoreController],
  providers: [AppService, PrismaService],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(session({
        secret: 'g5fd6gfd564gdf54az65ecx', // Utilisez une chaîne secrète forte ici
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false } // Activez `secure` uniquement en HTTPS
      }))
      .forRoutes('*'); // Appliquez la session à toutes les routes
  }
}