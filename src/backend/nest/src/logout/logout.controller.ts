import { Controller, Req, Res , Get} from '@nestjs/common';
import { Request, Response } from 'express';
import { Session } from '@nestjs/common';

@Controller('logout')
export class LogoutController {
    @Get()
    logout(@Req() req: Request, @Res() res: Response) {
        req.session.destroy();
        console.log("Session détruite cote serveur");
    }
}
