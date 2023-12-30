import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy2FA extends PassportStrategy(Strategy, "jwt2fa") {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'votre_secret_jwt',
    });
  }


  async validate(payload: any) {
	try {
		return payload
		// Logique de validation ici
	  } catch (error) {
		// Gérer l'erreur
		return false
	  }
  }
}