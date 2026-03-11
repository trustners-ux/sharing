import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { ContestService } from './contest.service';
import { CreateContestDto } from './dto/create-contest.dto';
import { AddMetricDto } from './dto/add-metric.dto';

@Controller('insurance/contests')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ContestController {
  constructor(private readonly contestService: ContestService) {}

  @Post()
  create(@Body() dto: CreateContestDto, @Request() req: any) {
    return this.contestService.createContest(dto, req.user.id);
  }

  @Get('my-performance')
  getMyPerformance(@Request() req: any, @Query('contestId') contestId?: string) {
    return this.contestService.getMyPerformance(req.user.id, contestId);
  }

  @Get()
  findAll(@Query('page') page?: string, @Query('limit') limit?: string, @Query('status') status?: string, @Query('type') type?: string) {
    return this.contestService.findAll(Number(page) || 1, Number(limit) || 20, { status, type });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contestService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: Partial<CreateContestDto>) {
    return this.contestService.updateContest(id, dto);
  }

  @Post(':id/activate')
  activate(@Param('id') id: string) {
    return this.contestService.activateContest(id);
  }

  @Post(':id/close')
  close(@Param('id') id: string) {
    return this.contestService.closeContest(id);
  }

  @Post(':id/calculate')
  calculate(@Param('id') id: string) {
    return this.contestService.calculateEntries(id);
  }

  @Get(':id/leaderboard')
  leaderboard(@Param('id') id: string, @Query('page') page?: string, @Query('limit') limit?: string) {
    return this.contestService.getLeaderboard(id, Number(page) || 1, Number(limit) || 20);
  }

  @Post(':id/metrics')
  addMetric(@Param('id') id: string, @Body() dto: AddMetricDto) {
    return this.contestService.addMetric(id, dto);
  }

  @Delete(':id/metrics/:metricId')
  removeMetric(@Param('id') id: string, @Param('metricId') metricId: string) {
    return this.contestService.removeMetric(id, metricId);
  }
}
