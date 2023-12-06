// auth.controller.ts
import { Controller, Get, Req, Session, UseGuards, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('authentification')
export class AuthentificationController {
  @Get('42')
  @UseGuards(AuthGuard('42'))
  async login42(@Req() req) {
    // L'utilisateur est automatiquement authentifié ici
  }

  @Get('42/callback')
  @UseGuards(AuthGuard('42'))
  async callback42(@Req() req, @Session() session: Record<string, any>) {
    // Gérer le callback après l'authentification
    // En fait on est la quand la personne a reussis a etre identifié

    // DOnc ici je refais une requete a l'api, a /me pour avoir les infos sur qui est la personne connecte
    // Dans authorisation je met le access tocker que le premier appel en api m'a donné
      const apiResponse = await fetch('https://api.intra.42.fr/v2/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${req.user.accessToken}`,
          'Content-Type': 'application/json'
        }
      });
    
      //Ici j'ai la reponse de l'api
      const userData = await apiResponse.json();

      // Ici j'ai enregistrer dans la session les infos que j'ai reçu
      // Tu peux aussi enregistrer celles qui t'interessent dans la bdd avec prisma, en une ligne ou 2
      session.user = { id: userData.id, login: userData.login, email: userData.email};
    return req.user;
  }

    // Un nouveau controlleur 42/profil
    // Si quelqu'un est pas connecté, il va ecrire "Aucun utilisateur connecté"
    // Mais si je me suis connecté sur /42
    // Et que je reviens dans 42/profil, j'ai toutes les infos
    // Le front pourra toujours faire un appel en appel a cet url pour avoir les infos
  @Get('42/profil')
  async profilSession42(@Req() req, @Session() session: Record<string, any>) {
    // Gérer le callback après l'authentification
    if (session.user) {
      return session.user;
    } else {
      return 'Aucun utilisateur connecté';
    return req.user;
  }
}
}

// Ca c'est le resultat de l'api en /me (en vrai y'a encore pleins d'autre choses derriere)
/*
trans-backend-1   | {
  trans-backend-1   |   id: 129410,
  trans-backend-1   |   email: 'snaggara@student.42.fr',
  trans-backend-1   |   login: 'snaggara',
  trans-backend-1   |   first_name: 'Samir',
  trans-backend-1   |   last_name: 'Naggara',
  trans-backend-1   |   usual_full_name: 'Samir Naggara',
  trans-backend-1   |   usual_first_name: null,
  trans-backend-1   |   url: 'https://api.intra.42.fr/v2/users/snaggara',
  trans-backend-1   |   phone: 'hidden',
  trans-backend-1   |   displayname: 'Samir Naggara',
  trans-backend-1   |   kind: 'student',
  trans-backend-1   |   image: {
  */