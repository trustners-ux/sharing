import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { HierarchyService } from './hierarchy.service';
import { HierarchyController } from './hierarchy.controller';

@Module({
  imports: [PrismaModule],
  controllers: [HierarchyController],
  providers: [HierarchyService],
  exports: [HierarchyService],
})
export class HierarchyModule {}
