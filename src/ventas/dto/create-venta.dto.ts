import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsNumber, IsOptional, IsPositive, IsUUID, Min, ValidateNested } from 'class-validator';
import { TipoVenta } from '../entities/venta.entity';

export class DetalleVentaDto {
  @IsUUID()
  productoId: string;

  @IsNumber()
  @Min(1)
  cantidad: number;

  @IsNumber()
  @IsPositive()
  precioUnitario: number;
}

export class CreateVentaDto {
  @IsOptional()
  @IsUUID()
  clienteId?: string;

  @IsEnum(TipoVenta)
  tipo: TipoVenta;

  @IsOptional()
  notas?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetalleVentaDto)
  detalles: DetalleVentaDto[];
}
