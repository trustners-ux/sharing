import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { ContestService } from './contest.service';
import { ContestController } from './contest.controller';

@Module({
  imports: [PrismaModule],
  controllers: [ContestController],
  providers: [ContestService],
  exports: [ContestService],
})
export class ContestModule {}
