import { IsString, IsOptional, IsNumber, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class MISFilterDto {
  @IsString() @IsOptional() department?: string;
  @IsString() @IsOptional() status?: string;
  @IsString() @IsOptional() lob?: string;
  @IsString() @IsOptional() pospId?: string;
  @IsString() @IsOptional() makerId?: string;
  @IsDateString() @IsOptional() startDate?: string;
  @IsDateString() @IsOptional() endDate?: string;
  @IsString() @IsOptional() search?: string;
  @Type(() => Number) @IsNumber() @IsOptional() page?: number;
  @Type(() => Number) @IsNumber() @IsOptional() limit?: number;
}
