import { Controller, Param, Post } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Controller('score')
export class ScoreController {
    constructor(private prisma: PrismaService) {}

    @Post(':winnerId/update_score/:loserId')
    async updateScore(@Param('winnerId') winnerId: string, @Param('loserId') loserId: string) {
        const winnerIdNum = Number(winnerId);
        const loserIdNum = Number(loserId);

        const existingScore = await this.prisma.score.findFirst({
            where: { 
                OR: [
                    { user1Id: winnerIdNum, user2Id: loserIdNum },
                    { user1Id: loserIdNum, user2Id: winnerIdNum }
                ], 
            },
        });

        if (!existingScore) {
            await this.prisma.score.create({
                data: {
                    user1Id: winnerIdNum,
                    user2Id: loserIdNum,
                    user1Wins: 1,
                },
            });
        } else {
            const isWinnerUser1 = existingScore.user1Id === winnerIdNum;
            await this.prisma.score.update({
                where: { id: existingScore.id },
                data: isWinnerUser1 ? 
                    { user1Wins: { increment: 1 } } : 
                    { user2Wins: { increment: 1 } }
            });
        }
        console.log('Score updated');
    }
}
