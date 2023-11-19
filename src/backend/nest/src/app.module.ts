import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SamTestController } from './sam-test/sam-test.controller';
import { PrismaService } from './prisma.service';


@Module({
  imports: [],
  controllers: [AppController, SamTestController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
