import { Body, Controller, Post, Get, Param, Patch } from '@nestjs/common';
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

    @Patch(':id')
    async updateUserById(@Param('id') id: string, @Body() body) {
        return await this.prisma.user.update({
            where: { id42: Number(id) },
            data: body,
        });
    }
}
