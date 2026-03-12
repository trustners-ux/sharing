import { IsString, IsOptional, IsEnum, IsNumber, IsDateString, IsBoolean, Min, Max } from 'class-validator';

export enum PospGradeCategoryDto {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  D_PLUS = 'D_PLUS',
  E = 'E',
  E_PLUS = 'E_PLUS',
  F1 = 'F1',
  F2 = 'F2',
  F3 = 'F3',
}

export enum BrokerageLOBDto {
  GI = 'GI',
  LI = 'LI',
  HI = 'HI',
}

export enum BrokerageTierDto {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

// --- Category Assignment ---
export class AssignCategoryDto {
  @IsString()
  pospId: string;

  @IsEnum(BrokerageLOBDto)
  lob: BrokerageLOBDto;

  @IsEnum(PospGradeCategoryDto)
  category: PospGradeCategoryDto;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsDateString()
  effectiveFrom?: string;
}

export class UpdateCategoryDto {
  @IsEnum(PospGradeCategoryDto)
  category: PospGradeCategoryDto;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsDateString()
  effectiveFrom?: string;
}

// --- Tier Sharing Config ---
export class CreateTierSharingDto {
  @IsEnum(PospGradeCategoryDto)
  category: PospGradeCategoryDto;

  @IsEnum(BrokerageTierDto)
  tier: BrokerageTierDto;

  @IsNumber()
  @Min(0)
  @Max(100)
  sharingPercent: number;
}

export class UpdateTierSharingDto {
  @IsNumber()
  @Min(0)
  @Max(100)
  sharingPercent: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

// --- Commission Product ---
export class CreateProductDto {
  @IsEnum(BrokerageLOBDto)
  lob: BrokerageLOBDto;

  @IsString()
  productLine: string;

  @IsString()
  productName: string;

  @IsString()
  insurer: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  trustnerCommission: number;

  @IsString()
  basis: string;

  @IsOptional()
  @IsString()
  remarks?: string;
}

export class UpdateProductDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  trustnerCommission?: number;

  @IsOptional()
  @IsString()
  basis?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  remarks?: string;
}

// --- Payout Calculation ---
export class CalculatePayoutDto {
  @IsString()
  pospId: string;

  @IsString()
  productId: string;

  @IsNumber()
  @Min(0)
  premiumAmount: number;

  @IsOptional()
  @IsString()
  policyId?: string;

  @IsOptional()
  @IsString()
  misEntryId?: string;
}

export class BulkCalculatePayoutDto {
  @IsNumber()
  periodMonth: number;

  @IsNumber()
  periodYear: number;
}
