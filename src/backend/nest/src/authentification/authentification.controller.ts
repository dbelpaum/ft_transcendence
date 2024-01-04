// auth.controller.ts
import { Controller, Get, Req, Res, UseGuards, Query, Post, Body, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { PrismaService } from '../prisma.service';
import { JwtStrategy } from './jwt.strategy';
import { JwtService } from '@nestjs/jwt';
import { AuthentificationService } from './authentification.service';
import { UserTokenInfo } from 'src/chat/chat.interface';
import { MutexInterceptor } from './mutex.interceptor';

@Controller('authentification')
export class AuthentificationController {
  constructor (
	private prisma: PrismaService,
	private jwtService: JwtService,
	private authentificationService: AuthentificationService){}

	
	private delay(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	  }
	  
	private async tryFetch(url, options, maxAttempts = 2, delayDuration = 1200) {
		try {
			await this.delay(delayDuration)
			const response = await fetch(url, options);
			if (!response.ok) {
			throw new Error(`API responded with status ${response.status}`);
			}
			return response.json();
		} catch (error) {
			if (maxAttempts > 1) {
				await this.delay(delayDuration); // Attendez ici avant de réessayer
				return await this.tryFetch(url, options, maxAttempts - 1, delayDuration);
			} else {
			throw error;
			}
		}
	}
  @Get('42')
  @UseInterceptors(new MutexInterceptor())
  @UseGuards(AuthGuard('42'))
  	async login42(@Req() req, ) {
		
    // L'utilisateur est automatiquement authentifié ici
  }

  @Get('42/error')
  error() {
    // Gérer la page d'erreur
  }

  @Get('42/callback')
  @UseInterceptors(new MutexInterceptor())
  async callback42(@Req() req, @Res() res: Response) {
	try{
		// Gérer le callback après l'authentification
		// En fait on est la quand la personne a reussis a etre identifié

		// DOnc ici je refais une requete a l'api, a /me pour avoir les infos sur qui est la personne connecte
		// Dans authorisation je met le access tocker que le premier appel en api m'a donné
		const apiOptions = {
			method: 'GET',
			headers: {
			'Authorization': `Bearer ${req.user.accessToken}`,
			'Content-Type': 'application/json'
			}
		};
	
		const userData = await this.tryFetch('https://api.intra.42.fr/v2/me', apiOptions);
	

		// Ici j'ai enregistrer dans la session les infos que j'ai reçu
		// Tu peux aussi enregistrer celles qui t'interessent dans la bdd avec prisma, en une ligne ou 2
		//   session.user = { id: userData.id, login: userData.login, email: userData.email, imageURL: userData.image.link, firstname: userData.first_name, lastname: userData.last_name};
		const findUser = await this.prisma.user.findUnique({
			where: {
			id42: userData.id,
			},
		});

		var dataToken;
		if (!findUser){
			const newUser = {
				id42: userData.id,
				pseudo: userData.login,
				email: userData.email,
				firstname: userData.first_name,
				lastname: userData.last_name,
				imageURL: userData.image.link,
			}
			const UserBdd = await this.prisma.user.create({
			data: newUser,
			});
			dataToken = {
				id: UserBdd.id,
				id42: UserBdd.id42,
				pseudo: UserBdd.pseudo,
				isConnected: true
			}
		}
		else
		{
			const isConnected = !findUser.isTwoFactorAuthEnabled
			dataToken = {
				id: findUser.id,
				id42: findUser.id42,
				pseudo: findUser.pseudo,
				isConnected: isConnected

			}
		}
		const token = this.jwtService.sign(dataToken);
		res.redirect(`http://localhost:3000/profil?token=${token}`);
	}catch (error) {
		// Gérez l'erreur ici
		console.error('Erreur lors de l’appel à l’API externe', error);
		res.redirect(`http://localhost:3000?error=errorAuthentification`);

	}	
}

    // Un nouveau controlleur 42/profil
    // Si quelqu'un est pas connecté, il va ecrire "Aucun utilisateur connecté"
    // Mais si je me suis connecté sur /42
    // Et que je reviens dans 42/profil, j'ai toutes les infos
    // Le front pourra toujours faire un appel en appel a cet url pour avoir les infos
	@Get('42/profil')
	@UseGuards(AuthGuard('jwt2fa'))
  	async profilSession42(@Req() req) {
		// Gérer le callback après l'authentification

		// 2fa n'est pas passé
		if (!req.user.isConnected) 
		{
			return {
				need2fa: true,
				id: req.user.id,
				pseudo: req.user.pseudo
			}
		}
		const userBdd = await this.prisma.user.findUnique({
			where: {
				id: req.user.id,
			},
			});
		if (userBdd) return userBdd
		return {undefined}

	}

	@Get('/auth-enabled')
	@UseGuards(AuthGuard('jwt'))
	async getAuthEnabled(@Req() req: Request & { user: UserTokenInfo }) {
		const data = await this.prisma.user.findUnique({
		    where: { id: req.user.id},
		});
		if (!data) return
		return {isActive: data.isTwoFactorAuthEnabled}
	}

	@Post('/2fa/turn-on')
	@UseGuards(AuthGuard('jwt'))
	async generate2faQrCode(@Req() req: Request & { user: UserTokenInfo }) {
		if (req.user)
		{
			("coucou " + req.user.id)
			const dataAuth = await this.authentificationService.generateTwoFactorAuthenticationSecret(req.user.id)
			if (!dataAuth) throw new Error("Error creating 2fa authentification secret")
			await this.prisma.user.update({
				where: { id: req.user.id },
				data: { 
					twoFactorSecret: dataAuth.secret,
					isTwoFactorAuthEnabled: true},
			});
			return {
				qrCode : dataAuth.qrCode
			}
		}
		return undefined
	}

	@Post('/2fa/turn-off')
	@UseGuards(AuthGuard('jwt'))
	async turnOff2fa(@Req() req: Request & { user: UserTokenInfo }) {
		await this.prisma.user.update({
			where: { id: req.user.id },
			data: { 
				twoFactorSecret: "",
				isTwoFactorAuthEnabled: false},
		});
		return {}
	}

	@Post('/2fa/validate')
	@UseGuards(AuthGuard('jwt2fa'))
	async turnOnTwoFactorAuthentication(@Req() req, @Body() body) {
		const isCodeValid = await this.authentificationService.isTwoFactorAuthenticationCodeValid(
				body.twoFactorAuthenticationCode,
				req.user,
			);
		if (!isCodeValid) return {success:false}
		const dataToken = {
			id: req.user.id,
			id42: req.user.id42,
			pseudo: req.user.pseudo,
			isConnected: true
		}
		const token = this.jwtService.sign(dataToken);
		return {newToken: token, success:true}
		

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