import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthentificationController } from './authentification.controller';
import { FortyTwoService } from './fortytwo/fortytwo.service';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ErrorHandlingMiddleware } from './fortytwo/error-handling.middleware';
import { AuthentificationService } from './authentification.service';
import { JwtStrategy2FA } from './jwt-2fa.strategy';

@Module({
	imports: [
		PassportModule,
		JwtModule.register({
		  secret: 'votre_secret_jwt', // Remplacez ceci par votre propre secret en production
		  signOptions: { expiresIn: '60m' }, // Durée de vie du token (ici 60 minutes)
		}),
		// Ajoutez d'autres modules si nécessaire
	  ],
  controllers: [AuthentificationController],
  providers: [FortyTwoService, PrismaService, JwtStrategy, JwtStrategy2FA, AuthentificationService],
})

export class AuthentificationModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
	  consumer
		.apply(ErrorHandlingMiddleware)
		.forRoutes('*'); // Appliquer à toutes les routes ou à des routes spécifiques
	}
  }
