import { IsNumber, IsOptional, IsPositive, IsString, Min, MinLength } from 'class-validator';

export class CreateProductoDto {
  @IsString()
  @MinLength(2)
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsNumber()
  @IsPositive()
  precio: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stockMinimo?: number;

  @IsOptional()
  @IsString()
  unidad?: string;
}
