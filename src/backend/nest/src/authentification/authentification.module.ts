import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthentificationController } from './authentification.controller';
import { FortyTwoService } from './fortytwo/fortytwo.service';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [AuthentificationController],
  providers: [FortyTwoService, PrismaService],
})
export class AuthentificationModule {}
