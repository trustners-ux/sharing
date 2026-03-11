import { IsString, IsOptional, IsEnum } from 'class-validator';

export class AssignGradeDto {
  @IsString()
  productId: string;

  @IsEnum(['A', 'B', 'C', 'D'])
  grade: string;

  @IsString()
  @IsOptional()
  commissionTier?: string;

  @IsEnum(['LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH'])
  complexityLevel: string;

  @IsString()
  @IsOptional()
  description?: string;
}
