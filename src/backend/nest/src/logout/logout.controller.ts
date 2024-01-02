import { Controller, Req, Res, Get } from '@nestjs/common';
import { Request, Response } from 'express';
import { Session } from '@nestjs/common';
import { error } from 'console';

@Controller('logout')
export class LogoutController {
	@Get()
	logout(@Req() req: Request, @Res() res: Response) {
		req.session.destroy((err) => {
			if (err) {
				console.error("Session destruction failed", err);
				return res.status(500).send("Internal Server Error");
			}
			res.send({ message: "Logout successful" });
		});
		// req.session = null;
		// console.log("Session détruite cote serveur");
	}
}
