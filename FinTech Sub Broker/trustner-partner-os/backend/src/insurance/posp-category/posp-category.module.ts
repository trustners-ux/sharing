import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { PospCategoryService } from './posp-category.service';
import { PospCategoryController } from './posp-category.controller';

/**
 * POSP Category-Based Brokerage Module
 * 10-grade POSP category system (A → F3) with dynamic tier-based commission sharing
 *
 * Features:
 * - Per-LOB category assignment (GI, LI, HI)
 * - Dynamic tier classification (HIGH/MEDIUM/LOW) based on Trustner's commission %
 * - Category × Tier sharing matrix (30 combinations)
 * - 245-product commission catalog
 * - Automated payout calculation engine
 * - Category history tracking
 */
@Module({
  imports: [PrismaModule],
  providers: [PospCategoryService],
  controllers: [PospCategoryController],
  exports: [PospCategoryService],
})
export class PospCategoryModule {}
