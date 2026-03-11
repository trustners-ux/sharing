import { IsString, IsOptional, IsEnum, IsNumber } from 'class-validator';

export class AddMetricDto {
  @IsEnum(['PREMIUM_VOLUME', 'POLICY_COUNT', 'NEW_CUSTOMERS', 'RENEWALS', 'COMMISSION_EARNED'])
  metricType: string;

  @IsNumber()
  weight: number;

  @IsNumber() @IsOptional()
  targetValue?: number;

  @IsString() @IsOptional()
  description?: string;
}
