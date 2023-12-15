import { Body, Controller, Post } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Controller('user')
export class UserController {
    constructor(private prismaService: PrismaService) {}

    @Post('create')
    async create(@Body() body: {username: string; email: string}) {
        return this.prismaService.user.create({
            data: {
                username: body.username,
                email: body.email,
            }
        })
    }

}
