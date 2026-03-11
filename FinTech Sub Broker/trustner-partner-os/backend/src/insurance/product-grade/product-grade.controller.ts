import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { ProductGradeService } from './product-grade.service';
import { AssignGradeDto } from './dto/assign-grade.dto';

@Controller('insurance/product-grades')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductGradeController {
  constructor(private readonly productGradeService: ProductGradeService) {}

  @Post()
  assignGrade(@Body() dto: AssignGradeDto) {
    return this.productGradeService.assignGrade(dto);
  }

  @Get('distribution')
  getDistribution() {
    return this.productGradeService.getGradeDistribution();
  }

  @Get()
  getAllGrades(@Query('grade') grade?: string, @Query('complexityLevel') complexityLevel?: string) {
    return this.productGradeService.getAllGrades({ grade, complexityLevel });
  }

  @Get(':productId')
  getGrade(@Param('productId') productId: string) {
    return this.productGradeService.getGrade(productId);
  }

  @Patch(':id')
  updateGrade(@Param('id') id: string, @Body() dto: Partial<AssignGradeDto>) {
    return this.productGradeService.updateGrade(id, dto);
  }

  @Post('auto-grade')
  autoGrade() {
    return this.productGradeService.autoGradeProducts();
  }
}
