import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { HierarchyModule } from '../hierarchy/hierarchy.module';
import { POSPService } from './posp.service';
import { POSPExportService } from './posp-export.service';
import { POSPController } from './posp.controller';

/**
 * POSP Management Module
 * Manages insurance agents (POSP - Point of Sale Person)
 * Handles onboarding, training, certification, activation, and hierarchy-scoped access
 * Supports Excel/CSV export for admin and CDM roles
 */
@Module({
  imports: [PrismaModule, HierarchyModule],
  providers: [POSPService, POSPExportService],
  controllers: [POSPController],
  exports: [POSPService],
})
export class POSPModule {}
