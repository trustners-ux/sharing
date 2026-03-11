import { IsObject } from 'class-validator';

export class ResolveGapsDto {
  @IsObject()
  gapData: Record<string, any>;
}
