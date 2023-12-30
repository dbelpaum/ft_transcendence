import { Injectable, Controller, Post, Body } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ScoreService {
  constructor(public prisma: PrismaService) {}

  async enregistrerScores(user1Id: number, user2Id: number, score1: number, score2: number): Promise<void> {
    try {
      const user1 = await this.prisma.user.findUnique({ where: { id: user1Id } });
      const user2 = await this.prisma.user.findUnique({ where: { id: user2Id } });

      if (!user1 || !user2) {
        throw new Error('Utilisateur inexistant');
      }

      const nouveauScore = await this.prisma.score.create({
        data: {
          user1: {
            connect: { id: user1Id },
          },
          user1Score: score1,
          user2: {
            connect: { id: user2Id },
          },
          user2Score: score2,
          createdAt: new Date(),
        },
      });

      console.log('Score enregistré avec succès :', nouveauScore);
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du score :', error);
      throw error;
    }
  }
}

@Controller('scores')
export class ScoreController {
  constructor(public scoreService: ScoreService) {}

  @Post('enregistrer')
  async enregistrerScore(@Body() body: { user1Id: number; user2Id: number; score1: number; score2: number }): Promise<void> {
    try {
      const { user1Id, user2Id, score1, score2 } = body;
      await this.scoreService.enregistrerScores(user1Id, user2Id, score1, score2);
    } catch (error) {
      throw new Error('Erreur lors de l\'enregistrement du score.');
    }
  }
}
