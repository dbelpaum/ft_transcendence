import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
    UploadedFile,
    UseInterceptors,
    Res,
    Response,
    Delete,
  } from '@nestjs/common';
  import {Express} from 'express';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from 'src/prisma.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { promisify } from 'util';
import * as fs from 'fs';
import { InternalRequestGuard } from 'src/score/internal-api';

const unlinkAsync = promisify(fs.unlink);


@Controller('user')
export class UserController {
    constructor(private prisma: PrismaService) {}
    /* recuperer tous les users */
    @Get('GetAllUsers')
    @UseGuards(AuthGuard('jwt'))
    async getAllUsers() {
    return await this.prisma.user.findMany();
    }

    /* ----------------------------GET---------------------------- */

    /* GET depuis un pseudo */
    @Get('by-pseudo/:pseudo')
    @UseGuards(AuthGuard('jwt'))

    async getUserByPseudo(@Param('pseudo') pseudo: string) {
        return await this.prisma.user.findUnique({
            where: { pseudo },
        });
    }

    @Get('by-pseudo-id/:pseudo')
	@UseGuards(InternalRequestGuard)
    async getUserIdByPseudo(@Param('pseudo') pseudo: string) {
        return await this.prisma.user.findUnique({
            where: { pseudo },
            select: { id: true },
        });

    }

  // ici
    @Get('wins')
    @UseGuards(AuthGuard('jwt'))
    async getUsersWins() {
      return await this.prisma.user.findMany({
        select: { pseudo: true, Wins: true },
      });
    }

    @Get('victories/:userId')
    @UseGuards(AuthGuard('jwt'))
    async getUserVictories(@Param('userId') userId: string) {
        const victories = await this.prisma.user.findFirst({
            where: {
                id42 : Number(userId),
            },
            select: {
              Wins:true,
            },
        });
        if (!victories) return { victories: 0 };
        return { victories: victories.Wins };
    }


    @Get(':id')
    @UseGuards(AuthGuard('jwt'))
    async getUserById42(@Param('id') id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id42: Number(id) },
        });

        return user ? user : null;
    }

    @Get('by-id/:id')
    @UseGuards(AuthGuard('jwt'))
    async getUserById(@Param('id') id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: Number(id) },
        });
        return user ? user : null;
    }
    
    @Get(':id/pseudo')
    @UseGuards(AuthGuard('jwt'))
    async getPseudo(@Param('id') id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id42: Number(id) },
            select: { pseudo: true },
        });
        return user ? user.pseudo : null;
    }
    
    @Get(':id/email')
    @UseGuards(AuthGuard('jwt'))
    async getEmail(@Param('id') id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id42: Number(id) },
            select: { email: true },
        });
        return user ? user.email : null;
    }

    @Get(':id/firstname')
    @UseGuards(AuthGuard('jwt'))
    async getFirstName(@Param('id') id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id42: Number(id) },
            select: { firstname: true },
        });
        return user ? user.firstname : null;
    }

    @Get(':id/lastname')
    @UseGuards(AuthGuard('jwt'))
    async getLastName(@Param('id') id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id42: Number(id) },
            select: { lastname: true },
        });
        return user ? user.lastname : null;
    }
    
    @Get(':id/image')
    @UseGuards(AuthGuard('jwt'))
    async getImage(@Param('id') id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id42: Number(id) },
            select: { imageURL: true },
        });
        return user ? user.imageURL : null;
    }

    /* -------------------------PATCH------------------------------ */
    
    @Patch(':id/pseudo')
    @UseGuards(AuthGuard('jwt'))
    async updatePseudo(@Param('id') id: string, @Body('pseudo') pseudo: string) {
      try{
        await this.prisma.user.update({
           where: { id42: Number(id) },
           data: { pseudo },
       });
      }
      catch(e){}
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

    @Post(':id/image')
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/profilepics',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.mimetype.split('/')[1]);
        },
      }),
    }))
    

    async uploadProfilePic(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
        const user = await this.prisma.user.findUnique({
            where: { id42: Number(id) },
            select: { imageURL: true },
          });
    
          if (user && user.imageURL) {
            try {
              const filePath = './uploads/profilepics/' + user.imageURL.split('/').pop();
              await unlinkAsync(filePath);
            } catch (error) {
              console.error('Erreur lors de la suppression de l\'image:', error);
            }
          }
      
        const imagePath = `http://localhost:4000/uploads/profilepics/${file.filename}`;
      return await this.prisma.user.update({
        where: { id42: Number(id) },
        data: { imageURL: imagePath },
      });
    }

    @Delete(':id/image')
    @UseGuards(AuthGuard('jwt'))
    async deleteProfilePic(@Param('id') id: string) {
      const user = await this.prisma.user.findUnique({
        where: { id42: Number(id) },
        select: { imageURL: true },
      });

      if (user && user.imageURL) {
        try {
          const filePath = './uploads/profilepics/' + user.imageURL.split('/').pop();
          await unlinkAsync(filePath);
        } catch (error) {
          console.error('Erreur lors de la suppression de l\'image:', error);
        }
      }
  

      return await this.prisma.user.update({
        where: { id42: Number(id) },
        data: { imageURL: null },
      });
    }
}

