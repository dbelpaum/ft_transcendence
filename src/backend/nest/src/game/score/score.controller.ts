import { PrismaClient, Score } from '@prisma/client';

const prisma = new PrismaClient();

export async function enregistrerScores(user1Id: string, user2Id: string, user1Score: number, user2Score: number): Promise<Score | null> {
  try {
    const nouveauScore = await prisma.score.create({
      data: {
        user1Id: user1Id,
        user1Score: user1Score,
        user2Id: user2Id,
        user2Score: user2Score,
        createdAt: new Date(), // Vous pouvez ajuster cela selon votre besoin
      },
    });

    // Mettre à jour la relation dans le modèle User pour user1 (user1Id)
    // await prisma.user.update({
    //   where: { id: user1Id },
    //   data: {
    //     myScores: {
    //       connect: { id: nouveauScore.id },
    //     },
    //   },
    // });

    // // Mettre à jour la relation dans le modèle User pour user2 (user2Id)
    // await prisma.user.update({
    //   where: { id: user2Id },
    //   data: {
    //     opponentScores: {
    //       connect: { id: nouveauScore.id },
    //     },
    //   },
    // });

    return nouveauScore;
  } catch (erreur) {
    console.error('Erreur lors de l\'enregistrement du score:', erreur);
    return null;
  }
}
