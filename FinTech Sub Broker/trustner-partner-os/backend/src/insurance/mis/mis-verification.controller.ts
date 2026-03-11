import { Controller, Get, Post, Delete, Body, Param, Query, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { MISVerificationService } from './mis-verification.service';

@Controller('insurance/mis/verification')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MISVerificationController {
  constructor(private readonly verificationService: MISVerificationService) {}

  @Post(':entryId/verify')
  verifyEntry(
    @Param('entryId') entryId: string,
    @Body() body: { action: string; remarks?: string },
    @Request() req: any,
  ) {
    return this.verificationService.verifyEntry(entryId, req.user.id, body.action, body.remarks);
  }

  @Get('pending')
  getPending(@Request() req: any, @Query('department') department?: string, @Query('page') page?: string, @Query('limit') limit?: string) {
    return this.verificationService.getPendingForChecker(req.user.id, Number(page) || 1, Number(limit) || 20, department);
  }

  @Get('history/:entryId')
  getHistory(@Param('entryId') entryId: string) {
    return this.verificationService.getVerificationHistory(entryId);
  }

  @Post('roles')
  assignRole(@Body() dto: any, @Request() req: any) {
    return this.verificationService.assignMISRole({ ...dto, assignedBy: req.user.id });
  }

  @Get('roles')
  getRoles(@Query('userId') userId?: string, @Query('department') department?: string) {
    return this.verificationService.getMISRoles({ userId, department });
  }

  @Delete('roles/:id')
  removeRole(@Param('id') id: string) {
    return this.verificationService.removeMISRole(id);
  }
}
