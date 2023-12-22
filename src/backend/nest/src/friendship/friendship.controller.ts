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


    @Get(':requesterId/relation/:addresseeId')
    async getFriendshipStatus(
        @Param('requesterId') requesterId: string,
        @Param('addresseeId') addresseeId: string
    ) {
        const status = await this.prisma.friendship.findUnique({
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

        if (!status) {
            throw new Error('Friendship not found');
        }

        return status;
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
                    { requesterId: Number(requesterId), addresseeId: Number(addresseeId) },
                    { requesterId: Number(addresseeId), addresseeId: Number(requesterId) }
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
                status: 'pending', // Le statut initial est "pending"
            },
        });

        return !!friendship;
    }





    
    @Post(':requesterId/accept-friend/:addresseeId')
    async acceptFriend(
        @Param('requesterId') requesterId: string,
        @Param('addresseeId') addresseeId: string
    ) {
        // On vérifie que le requester et l'addressee existent
        const requester = await this.prisma.user.findUnique({
            where: { id42: Number(requesterId) },
        });

        if (!requester) {
            throw new Error('Requester not found');
        }

        const addressee = await this.prisma.user.findUnique({
            where: { id42: Number(addresseeId) },
        });

        if (!addressee) {
            throw new Error('Addressee not found');
        }

        // On vérifie que les deux users sont bien amis
        const friendship = await this.prisma.friendship.findFirst({
            where: {
                OR: [
                    { requesterId: Number(requesterId), addresseeId: Number(addresseeId) },
                    { requesterId: Number(addresseeId), addresseeId: Number(requesterId) }
                ],
                status: 'pending',
            },
        });

        if (!friendship) {
            throw new Error('Friendship not found');
        }

        // On met à jour le statut de l'amitié
        const updatedFriendship = await this.prisma.friendship.update({
            where: { id: friendship.id },
            data: { status: 'accepted' },
        });

        return updatedFriendship;
    }
}