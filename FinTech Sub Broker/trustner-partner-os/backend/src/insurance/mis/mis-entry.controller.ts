import { Controller, Get, Post, Patch, Body, Param, Query, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { MISEntryService } from './mis-entry.service';
import { CreateMISEntryDto } from './dto/create-mis-entry.dto';
import { UpdateMISEntryDto } from './dto/update-mis-entry.dto';
import { ResolveGapsDto } from './dto/resolve-gaps.dto';
import { MISFilterDto } from './dto/mis-filter.dto';

@Controller('insurance/mis/entries')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MISEntryController {
  constructor(private readonly misEntryService: MISEntryService) {}

  @Post()
  createEntry(@Body() dto: CreateMISEntryDto, @Request() req: any) {
    return this.misEntryService.createManualEntry(dto, req.user.id);
  }

  @Post('upload')
  uploadFile(@Body() body: { parsedRows: any[]; batchId: string }, @Request() req: any) {
    return this.misEntryService.createFromFileUpload(body.parsedRows, body.batchId, req.user.id);
  }

  @Get('stats')
  getStats(@Query('department') department?: string, @Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
    return this.misEntryService.getDashboardStats({ department, startDate, endDate });
  }

  @Get('my-entries')
  getMyEntries(@Request() req: any, @Query('page') page?: string, @Query('limit') limit?: string) {
    return this.misEntryService.getMyEntries(req.user.id, Number(page) || 1, Number(limit) || 20);
  }

  @Get('pending')
  getPending(@Query('department') department?: string, @Query('page') page?: string, @Query('limit') limit?: string) {
    return this.misEntryService.getPendingVerification(department, Number(page) || 1, Number(limit) || 20);
  }

  @Get()
  findAll(@Query() filters: MISFilterDto) {
    return this.misEntryService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.misEntryService.findOne(id);
  }

  @Patch(':id')
  updateEntry(@Param('id') id: string, @Body() dto: UpdateMISEntryDto, @Request() req: any) {
    return this.misEntryService.updateEntry(id, dto, req.user.id);
  }

  @Patch(':id/resolve-gaps')
  resolveGaps(@Param('id') id: string, @Body() dto: ResolveGapsDto, @Request() req: any) {
    return this.misEntryService.resolveGaps(id, dto.gapData, req.user.id);
  }
}
