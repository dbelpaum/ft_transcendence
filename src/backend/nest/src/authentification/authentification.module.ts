import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthentificationController } from './authentification.controller';
import { FortyTwoService } from './fortytwo/fortytwo.service';

@Module({
  controllers: [AuthentificationController],
  providers: [FortyTwoService]
})
export class AuthentificationModule {}
