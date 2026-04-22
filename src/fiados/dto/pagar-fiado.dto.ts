import { IsNumber, IsOptional, IsPositive } from 'class-validator';

export class PagarFiadoDto {
  @IsNumber()
  @IsPositive()
  monto: number;

  @IsOptional()
  notas?: string;
}
