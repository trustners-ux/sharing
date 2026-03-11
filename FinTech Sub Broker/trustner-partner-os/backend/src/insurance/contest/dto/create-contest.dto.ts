import { IsString, IsOptional, IsEnum, IsDateString, IsArray, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ContestMetricDto {
  @IsEnum(['PREMIUM_VOLUME', 'POLICY_COUNT', 'NEW_CUSTOMERS', 'RENEWALS', 'COMMISSION_EARNED'])
  metricType: string;

  @IsNumber()
  weight: number;

  @IsNumber() @IsOptional()
  targetValue?: number;

  @IsString() @IsOptional()
  description?: string;
}

export class CreateContestDto {
  @IsString()
  name: string;

  @IsString() @IsOptional()
  description?: string;

  @IsEnum(['MONTHLY', 'QUARTERLY', 'HALF_YEARLY', 'ANNUAL'])
  type: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsEnum(['HEALTH', 'LIFE', 'GENERAL']) @IsOptional()
  departmentFilter?: string;

  @IsNumber() @IsOptional()
  hierarchyLevelFilter?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContestMetricDto)
  metrics: ContestMetricDto[];
}
