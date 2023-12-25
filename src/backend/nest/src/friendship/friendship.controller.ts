import { Controller , Post, Param, Get} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Controller('friendship')
export class FriendshipController {
    constructor(private prisma: PrismaService) {}

    @Get()
    async getAllFriendships() {
        const friendships = await this.prisma.friendship.findMany();
        return friendships;
    }

    /* voir si ami ou pas */

    @Get(':requesterId/relation/:addresseeId')
    async getFriendshipStatus(
        @Param('requesterId') requesterId: string,
        @Param('addresseeId') addresseeId: string
    ) {
        const friendship = await this.prisma.friendship.findUnique({
            where: {
                requesterId_addresseeId: {
                    requesterId: Number(requesterId),
                    addresseeId: Number(addresseeId),
                },
            },
            select: {
                status: true,
            },
        });

        if (!friendship) {
            console.log("notFriend");
            return { status: 'notFriend'};
        }

        return friendship;
    }


    @Post(':requesterId/add-friend/:addresseeId')
    async addFriend(
        @Param('requesterId') requesterId: string,
        @Param('addresseeId') addresseeId: string
    ) {

        console.log("requesterId : " + requesterId);
        console.log("addresseeId : " + addresseeId);
        if (requesterId === addresseeId) {
            throw new Error('You cannot add yourself as a friend');
        }

        // On vérifie que le requester et l'addressee existent
        const requester = await this.prisma.user.findUnique({
            where: { id: Number(requesterId) },
        });

        if (!requester) {
            throw new Error('Requester not found');
        }

        const addressee = await this.prisma.user.findUnique({
            where: { id: Number(addresseeId) },
        });

        if (!addressee) {
            throw new Error('Addressee not found');
        }

        // On vérifie que les deux users ne sont pas déjà amis

        const existingFriendship = await this.prisma.friendship.findFirst({
            where: {
                OR: [
                    { requesterId: Number(requesterId), addresseeId: Number(addresseeId) }
                ],
                // status: { not: 'blocked' }, // On ne peut pas ajouter un ami si on est bloqué
            },
        });
        if (existingFriendship) {
            throw new Error('Users are already friends');
        }

        const friendship = await this.prisma.friendship.create({
            data: {
                requesterId: Number(requesterId),
                addresseeId: Number(addresseeId),
                status: 'friend', // Le statut initial est "pending"
            },
        });

        return friendship;
    }

    // FriendshipController

    @Post(':requesterId/remove-friend/:addresseeId')
    async removeFriend(
        @Param('requesterId') requesterId: string,
        @Param('addresseeId') addresseeId: string
    ) {
        if (requesterId === addresseeId) {
            throw new Error('You cannot remove yourself as a friend');
        }

        // Deleting the friendship where the requester is the current user
        const friendship = await this.prisma.friendship.deleteMany({
            where: {
                requesterId: Number(requesterId),
                addresseeId: Number(addresseeId),
            },
        });

        // If no friendship is deleted, throw an error
        if (friendship.count === 0) {
            throw new Error('Friendship not found');
        }

        return { message: 'Friendship removed' };
}






    
    
}
