import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Controller('user')
export class UserController {
    constructor(private prisma: PrismaService) {}

    @Get(':id')
    async getUserById(@Param('id') id: string) {
        console.log(id);
        return await this.prisma.user.findUnique({
            where: { id42: Number(id) },
        });
    }
}
