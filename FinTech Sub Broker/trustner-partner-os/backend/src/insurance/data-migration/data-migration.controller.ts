import { Controller, Post, Get, Body, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { DataMigrationService } from './data-migration.service';

@Controller('insurance/data-migration')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DataMigrationController {
  constructor(private readonly migrationService: DataMigrationService) {}

  @Get('status')
  getStatus() {
    return this.migrationService.getMigrationStatus();
  }

  @Post('clients')
  importClients(@Body() body: { rows: any[] }, @Request() req: any) {
    return this.migrationService.importClients(body.rows, req.user.id);
  }

  @Post('policy-register')
  importPolicyRegister(@Body() body: { rows: any[] }, @Request() req: any) {
    return this.migrationService.importPolicyRegister(body.rows, req.user.id);
  }

  @Post('payout-data')
  importPayoutData(@Body() body: { rows: any[] }, @Request() req: any) {
    return this.migrationService.importPayoutData(body.rows, req.user.id);
  }

  @Post('renewal-due')
  importRenewalDue(@Body() body: { rows: any[] }, @Request() req: any) {
    return this.migrationService.importRenewalDue(body.rows, req.user.id);
  }
}
