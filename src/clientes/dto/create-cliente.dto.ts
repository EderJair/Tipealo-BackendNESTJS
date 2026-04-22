import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateClienteDto {
  @IsString()
  @MinLength(2)
  nombre: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  direccion?: string;

  @IsOptional()
  @IsString()
  notas?: string;
}
