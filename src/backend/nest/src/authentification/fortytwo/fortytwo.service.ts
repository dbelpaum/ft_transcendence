// fortytwo.service.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';

@Injectable()
export class FortyTwoService extends PassportStrategy(Strategy, '42') {
  constructor() {
    super({
      clientID: process.env.FORTYTWO_APP_ID,
      clientSecret: process.env.FORTYTWO_APP_SECRET,
      callbackURL: process.env.FORTYTWO_CALLBACK,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any): Promise<any> {
	try {
		const user = {
		  fortytwoId: profile.id,
		  accessToken
		};
		return user;
	  } catch (error) {
		throw new Error('Erreur d\'autehntificaiton 42');
		
	  }
  }
}
