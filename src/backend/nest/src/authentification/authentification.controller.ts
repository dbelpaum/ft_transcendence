// auth.controller.ts
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('authentification')
export class AuthentificationController {
  @Get('42')
  @UseGuards(AuthGuard('42'))
  async login42(@Req() req) {
    // L'utilisateur est automatiquement authentifié ici
  }

  @Get('42/callback')
  @UseGuards(AuthGuard('42'))
  async callback42(@Req() req) {
    // Gérer le callback après l'authentification
    return req.user;
  }

}
