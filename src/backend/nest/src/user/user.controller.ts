import { Body, Controller, Get, Param, Patch, Post, UseGuards , UploadedFile, UseInterceptors} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from 'src/prisma.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';


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
        console.log("Requete bien recue : " + user.imageURL)
        return user ? user.imageURL : null;
    }

    /* -------------------------PATCH------------------------------ */
    
    @Patch(':id/pseudo')
    @UseGuards(AuthGuard('jwt'))
    async updatePseudo(@Param('id') id: string, @Body('pseudo') pseudo: string) {
        return await this.prisma.user.update({
            where: { id42: Number(id) },
            data: { pseudo },
        });
    }


    @Patch(':id/email')
    @UseGuards(AuthGuard('jwt'))
    async updateEmail(@Param('id') id: string, @Body('email') email: string) {
        return await this.prisma.user.update({
            where: { id42: Number(id) },
            data: { email },
        });
    }

    @Patch(':id/firstname')
    @UseGuards(AuthGuard('jwt'))
    async updateFirstName(@Param('id') id : string, @Body('firstname') firstname: string) {
        return await this.prisma.user.update({
            where: { id42: Number(id) },
            data: { firstname },
        });
    }

    @Patch(':id/lastname')
    @UseGuards(AuthGuard('jwt'))
    async updateLastName(@Param('id') id : string, @Body('lastname') lastname: string) {
        return await this.prisma.user.update({
            where: { id42: Number(id) },
            data: { lastname },
        });
    }

    @Patch(':id/bio')
    @UseGuards(AuthGuard('jwt'))
    async updateBio(@Param('id') id : string, @Body('bio') bio: string) {
        return await this.prisma.user.update({
            where: { id42: Number(id) },
            data: { bio },
        });
    }

}

