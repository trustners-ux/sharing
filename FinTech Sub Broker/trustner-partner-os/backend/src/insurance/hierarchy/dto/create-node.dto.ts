import { IsString, IsOptional, IsEnum } from 'class-validator';

export class CreateNodeDto {
  @IsString()
  userId: string;

  @IsString()
  hierarchyLevelId: string;

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
}
