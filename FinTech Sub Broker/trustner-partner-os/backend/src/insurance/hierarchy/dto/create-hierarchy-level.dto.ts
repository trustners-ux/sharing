import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateHierarchyLevelDto {
  @IsNumber()
  levelNumber: number;

  @IsString()
  levelName: string;

  @IsString()
  levelCode: string;

  @IsString()
  @IsOptional()
  description?: string;
}
