import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { ProductGradeService } from './product-grade.service';
import { ProductGradeController } from './product-grade.controller';

@Module({
  imports: [PrismaModule],
  controllers: [ProductGradeController],
  providers: [ProductGradeService],
  exports: [ProductGradeService],
})
export class ProductGradeModule {}
