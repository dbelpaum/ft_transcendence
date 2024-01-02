import { Controller, Get, Param, Post , UseGuards} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AuthGuard } from '@nestjs/passport';
import { UserTokenInfo } from 'src/chat/chat.interface';

@Controller('score')
export class ScoreController {
    constructor(private prisma: PrismaService) {}

    @Get(':userId/consult_score/:opponentId')
    @UseGuards(AuthGuard('jwt'))
    async consultScore(@Param('userId') userId: string, @Param('opponentId') opponentId: string) {
        const userIdNum = Number(userId);
        const opponentIdNum = Number(opponentId);

        const existingScore = await this.prisma.score.findFirst({
            where: { 
                OR: [
                    { user1Id: userIdNum, user2Id: opponentIdNum },
                    { user1Id: opponentIdNum, user2Id: userIdNum }
                ], 
            },
        });

        if (!existingScore) {
            return {
                user1Id: userIdNum,
                user2Id: opponentIdNum,
                user1Wins: 0,
                user2Wins: 0,
            };
        }

        return existingScore;
    }


    @Post(':winnerId/update_score/:loserId')
    // @UseGuards(AuthGuard('jwt'))
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
            console.log('Score not found, creating new score');
            await this.prisma.score.create({
                data: {
                    user1Id: winnerIdNum,
                    user2Id: loserIdNum,
                    user1Wins: 1,
                },
            });
        } else {
            console.log('Score found, updating');
            const isWinnerUser1 = existingScore.user1Id === winnerIdNum;
            await this.prisma.score.update({
                where: { id: existingScore.id },
                data: isWinnerUser1 ? 
                    { user1Wins: { increment: 1 } } : 
                    { user2Wins: { increment: 1 } }
            });
        }
        
    }
}
