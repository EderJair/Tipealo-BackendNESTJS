import { IsDateString, IsNumber, IsOptional, IsPositive, IsUUID } from 'class-validator';

export class CreateFiadoDto {
  @IsUUID()
  clienteId: string;

  @IsNumber()
  @IsPositive()
  monto: number;

  @IsOptional()
  @IsDateString()
  fechaVencimiento?: string;

  @IsOptional()
  notas?: string;
}
