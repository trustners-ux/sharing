import { IsString, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateNodeDto {
  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsOptional()
  hierarchyLevelId?: string;

  @IsString()
  @IsOptional()
  parentId?: string;

  @IsEnum(['HEALTH', 'LIFE', 'GENERAL'])
  @IsOptional()
  departmentType?: string;

  @IsString()
  @IsOptional()
  branchId?: string;

  @IsString()
  @IsOptional()
  regionName?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @Type(() => Date)
  @IsOptional()
  effectiveTo?: Date;
}
