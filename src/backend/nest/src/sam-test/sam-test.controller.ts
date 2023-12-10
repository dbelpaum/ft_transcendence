import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Controller('sam-test')
export class SamTestController {
	constructor(private prisma: PrismaService){}

	@Get()
	async getTexte(): Promise<any> {
		try{
			var user = await this.prisma.user.findFirst()
			return {
				message: "Voila le nom du premier utilisateur : " + (user ? user.pseudo : "Personne dans la bdd")
			}
		} catch (error)
		{
			return {
				message: "Une erreur s'est produite en rapport avec la bdd "
			}
		}
	}
}
