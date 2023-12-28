import { Controller , Post, Param, Get, UseGuards} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AuthGuard } from '@nestjs/passport';


@Controller('friendship')
export class FriendshipController {
    constructor(private prisma: PrismaService) {}

    @Get()
    async getAllFriendships() {
        const friendships = await this.prisma.friendship.findMany();
        return friendships;
    }


    @Get(':userId/friends-and-blocked')
    @UseGuards(AuthGuard('jwt'))
async getFriendsAndBlocked(@Param('userId') userId: string) {
    const friends = await this.prisma.friendship.findMany({
        where: {
            OR: [
                { requesterId: Number(userId), status: 'friend' },
                
            ],
        },
        include: {
            addressee: true
        }
    });

    const blocked = await this.prisma.friendship.findMany({
        where: {
            requesterId: Number(userId),
            status: 'blocked',
        },
        include: {
            addressee: true
        }
    });

    console.log("friends:", JSON.stringify(friends, null, 2));
console.log("blocked:", JSON.stringify(blocked, null, 2));

    return { friends, blocked };
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
        });

        if (!friendship) {
            console.log("notFriend a ete renvoye AAAAAAAAAAAAAAAAAA")
            return { status: 'notFriend' };
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
                status: 'friend',
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
        // Ensure that requesterId and addresseeId are not the same
        if (requesterId === addresseeId) {
            // throw new HttpException('You cannot remove yourself as a friend', HttpStatus.BAD_REQUEST);
            throw new Error('You cannot remove yourself as a friend');
        }

        // Check if the friendship exists
        const friendship = await this.prisma.friendship.findUnique({
            where: {
                requesterId_addresseeId: {
                    requesterId: Number(requesterId),
                    addresseeId: Number(addresseeId),
                },
            },
        });

        if (!friendship) {
            // throw new HttpException('Friendship does not exist', HttpStatus.NOT_FOUND);
            console.log("Friendship does not exist");
        }

        // Delete the friendship
        await this.prisma.friendship.delete({
            where: {
                requesterId_addresseeId: {
                    requesterId: Number(requesterId),
                    addresseeId: Number(addresseeId),
                },
            },
        });

        return { message: 'Friendship removed successfully' };
    }



    @Post(':requesterId/block/:addresseeId')
    async blockUser(
        @Param('requesterId') requesterId: string,
        @Param('addresseeId') addresseeId: string
    ) {
        // Ensure that requesterId and addresseeId are not the same
        if (requesterId === addresseeId) {
            throw new Error('You cannot block yourself');
        }

        // Check if the friendship exists
        const friendship = await this.prisma.friendship.findUnique({
            where: {
                requesterId_addresseeId: {
                    requesterId: Number(requesterId),
                    addresseeId: Number(addresseeId),
                },
            },
        });

        if (!friendship) {
            const friendship = await this.prisma.friendship.create({
                data: {
                    requesterId: Number(requesterId),
                    addresseeId: Number(addresseeId),
                    status: 'blocked',
                },
            });
        }

        // Update the friendship status to blocked
        const blockedFriendship = await this.prisma.friendship.update({
            where: {
                requesterId_addresseeId: {
                    requesterId: Number(requesterId),
                    addresseeId: Number(addresseeId),
                },
            },
            data: {
                status: 'blocked',
            },
        });

        return blockedFriendship;
    }


    
    @Post(':requesterId/unblock/:addresseeId')
    async unblockUser(
        @Param('requesterId') requesterId: string,
        @Param('addresseeId') addresseeId: string
    ) {
        // Ensure that requesterId and addresseeId are not the same
        if (requesterId === addresseeId) {
            throw new Error('You cannot unblock yourself');
        }

        // Check if the friendship exists
        const friendship = await this.prisma.friendship.findUnique({
            where: {
                requesterId_addresseeId: {
                    requesterId: Number(requesterId),
                    addresseeId: Number(addresseeId),
                },
            },
        });

        if (!friendship) {
            throw new Error('Friendship does not exist');
        }

        // Update the friendship status to friend
        const unblockedFriendship = await this.prisma.friendship.delete({
            where: {
                requesterId_addresseeId: {
                    requesterId: Number(requesterId),
                    addresseeId: Number(addresseeId),
                },
            },
        });

        return unblockedFriendship;
    }


    




    
}
