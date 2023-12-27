import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';
import { User } from 'src/chat/chat.interface';
import { PrismaService } from 'src/prisma.service';


@Injectable()
export class AuthentificationService {
    constructor(private prisma: PrismaService) {}

    async generateTwoFactorAuthenticationSecret(userId: number) {
        // Récupérer l'utilisateur et son e-mail depuis la base de données
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new Error('Utilisateur introuvable');
        }

        const secret = authenticator.generateSecret();
        const otpauthUrl = authenticator.keyuri(user.email, process.env.AUTH_NAME, secret);
		console.log(user.email)
		console.log(otpauthUrl)
		console.log(process.env.AUTH_NAME)
		const qrCode = await this.generateQrCodeDataURL(otpauthUrl)
        await this.prisma.user.update({
            where: { id: userId },
            data: { twoFactorSecret: secret },
        });

        return {
            secret,
            otpauthUrl,
			qrCode
        };
    }

	async generateQrCodeDataURL(otpAuthUrl: string) {
		return toDataURL(otpAuthUrl);
	}

	isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, user: User) {
		return authenticator.verify({
		  token: twoFactorAuthenticationCode,
		  secret: user.twoFactorSecret,
		});
	  }
}
