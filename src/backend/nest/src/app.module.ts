import { Module ,NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SamTestController } from './sam-test/sam-test.controller';
import { PrismaService } from './prisma.service';
import { AuthentificationModule } from './authentification/authentification.module';
import { ChatModule } from './chat/chat.module';
import { GameGateway } from './game/game.gateway';
import * as session from 'express-session';

@Module({
  imports: [AuthentificationModule, ChatModule],
  controllers: [AppController, SamTestController],
  providers: [AppService, PrismaService, GameGateway],
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