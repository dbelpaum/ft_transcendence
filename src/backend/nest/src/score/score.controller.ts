import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AuthGuard } from '@nestjs/passport';
import { UserTokenInfo } from 'src/chat/chat.interface';
import { InternalRequestGuard } from './internal-api';

@Controller('score')
export class ScoreController {
	constructor(private prisma: PrismaService) { }

    @Get('matches/:userId')
	@UseGuards(AuthGuard('jwt'))
    async getUserMatches(@Param('userId') userId: string) {
        const userMatches = await this.prisma.score.findMany({
            where: {
                OR: [
                    { user1Id: Number(userId) },
                    { user2Id: Number(userId) }
                ],
            },
        });

        return userMatches;
    }


    @Post('create_match/:winnerId/:loserId/:loserScore')
	@UseGuards(InternalRequestGuard)
    async createScore(@Param('winnerId') winnerId: string, @Param('loserId') loserId: string, @Param('loserScore') loserScore: string) {
        const data = {
            user1Id: Number(winnerId),
            user2Id: Number(loserId),
            user1Score: 5,
            user2Score: Number(loserScore),
        };

        const winner = await this.prisma.user.findUnique({
            where: { id: Number(winnerId) },
            select:{ Wins: true}
            
        });

        if (winner) {
            await this.prisma.user.update({
                where: { id: Number(winnerId) },
                data: { Wins: winner.Wins + 1 },
            });
        }
        
        console.log(winner);

        try {
            const newGame = await this.prisma.score.create({
                data,
            });
            console.log(newGame);
            return newGame;
        } catch (error) {
            console.error(error);
            // Gérer l'erreur ici (par exemple, en renvoyant une réponse d'erreur)
        }
    }
}
