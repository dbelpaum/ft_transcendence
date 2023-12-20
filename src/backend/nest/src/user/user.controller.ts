import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Controller('user')
export class UserController {
    constructor(private prisma: PrismaService) {}
    /* recuperer tous les users */
    @Get('GetAllUsers')
    async getAllUsers() {
    return await this.prisma.user.findMany();
    }

    /* ----------------------------GET---------------------------- */

    /* GET depuis un pseudo */
    @Get('by-pseudo/:pseudo')
    async getUserByPseudo(@Param('pseudo') pseudo: string) {
        return await this.prisma.user.findUnique({
            where: { pseudo },
        });
    }






    @Get(':id')
    async getUserById(@Param('id') id: string) {
        return await this.prisma.user.findUnique({
            where: { id42: Number(id) },
        });
    }
    
    @Get(':id/pseudo')
    async getPseudo(@Param('id') id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id42: Number(id) },
            select: { pseudo: true },
        });
        return user ? user.pseudo : null;
    }
    
    @Get(':id/email')
    async getEmail(@Param('id') id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id42: Number(id) },
            select: { email: true },
        });
        return user ? user.email : null;
    }

    @Get(':id/firstname')
    async getFirstName(@Param('id') id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id42: Number(id) },
            select: { firstname: true },
        });
        return user ? user.firstname : null;
    }

    @Get(':id/lastname')
    async getLastName(@Param('id') id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id42: Number(id) },
            select: { lastname: true },
        });
        return user ? user.lastname : null;
    }
    
    @Get(':id/image')
    async getImage(@Param('id') id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id42: Number(id) },
            select: { imageURL: true },
        });
        return user ? user.imageUrl : null;
    }

    /* -------------------------PATCH------------------------------ */
    
    @Patch(':id/pseudo')
    async updatePseudo(@Param('id') id: string, @Body('pseudo') pseudo: string) {
        return await this.prisma.user.update({
            where: { id42: Number(id) },
            data: { pseudo },
        });
    }


    @Patch(':id/email')
    async updateEmail(@Param('id') id: string, @Body('email') email: string) {
        return await this.prisma.user.update({
            where: { id42: Number(id) },
            data: { email },
        });
    }

    @Patch(':id/firstname')
    async updateFirstName(@Param('id') id : string, @Body('firstname') firstname: string) {
        return await this.prisma.user.update({
            where: { id42: Number(id) },
            data: { firstname },
        });
    }

    @Patch(':id/lastname')
    async updateLastName(@Param('id') id : string, @Body('lastname') lastname: string) {
        return await this.prisma.user.update({
            where: { id42: Number(id) },
            data: { lastname },
        });
    }

    @Patch(':id/bio')
    async updateBio(@Param('id') id : string, @Body('bio') bio: string) {
        return await this.prisma.user.update({
            where: { id42: Number(id) },
            data: { bio },
        });
    }

}

