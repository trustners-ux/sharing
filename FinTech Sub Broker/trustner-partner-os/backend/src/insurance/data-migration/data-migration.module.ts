import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { DataMigrationService } from './data-migration.service';
import { DataMigrationController } from './data-migration.controller';

@Module({
  imports: [PrismaModule],
  controllers: [DataMigrationController],
  providers: [DataMigrationService],
  exports: [DataMigrationService],
})
export class DataMigrationModule {}
