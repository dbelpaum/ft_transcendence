import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Controller('user')
export class UserController {
    constructor(private prisma: PrismaService) {}

    @Get(':id')
    async getUserById(@Param('id') id: string) {
        return await this.prisma.user.findUnique({
            where: { id42: Number(id) },
        });
    }

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

    

}
