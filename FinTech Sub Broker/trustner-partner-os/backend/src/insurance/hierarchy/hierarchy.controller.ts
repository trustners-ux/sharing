import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { HierarchyService } from './hierarchy.service';
import { CreateHierarchyLevelDto } from './dto/create-hierarchy-level.dto';
import { CreateNodeDto } from './dto/create-node.dto';
import { UpdateNodeDto } from './dto/update-node.dto';

@Controller('insurance/hierarchy')
@UseGuards(JwtAuthGuard, RolesGuard)
export class HierarchyController {
  constructor(private readonly hierarchyService: HierarchyService) {}

  @Post('levels')
  createLevel(@Body() dto: CreateHierarchyLevelDto) {
    return this.hierarchyService.createHierarchyLevel(dto);
  }

  @Get('levels')
  getLevels() {
    return this.hierarchyService.getHierarchyLevels();
  }

  @Patch('levels/:id')
  updateLevel(@Param('id') id: string, @Body() dto: Partial<CreateHierarchyLevelDto>) {
    return this.hierarchyService.updateHierarchyLevel(id, dto);
  }

  @Post('nodes')
  createNode(@Body() dto: CreateNodeDto) {
    return this.hierarchyService.createNode(dto);
  }

  @Patch('nodes/:id')
  updateNode(@Param('id') id: string, @Body() dto: UpdateNodeDto) {
    return this.hierarchyService.updateNode(id, dto);
  }

  @Get('tree')
  getTree(@Query('rootId') rootId?: string) {
    return this.hierarchyService.getNodeTree(rootId);
  }

  @Get('tree/:nodeId')
  getSubtree(@Param('nodeId') nodeId: string) {
    return this.hierarchyService.getNodeTree(nodeId);
  }

  @Get('user/:userId')
  getUserPosition(@Param('userId') userId: string) {
    return this.hierarchyService.getUserHierarchyPosition(userId);
  }

  @Get('team/:nodeId')
  getTeamMembers(@Param('nodeId') nodeId: string) {
    return this.hierarchyService.getTeamMembers(nodeId);
  }

  @Get('department/:department')
  getDepartmentHierarchy(@Param('department') department: string) {
    return this.hierarchyService.getDepartmentHierarchy(department);
  }
}
