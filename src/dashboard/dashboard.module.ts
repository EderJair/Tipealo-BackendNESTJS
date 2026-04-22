import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Venta } from '../ventas/entities/venta.entity';
import { Fiado } from '../fiados/entities/fiado.entity';
import { Producto } from '../productos/entities/producto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Venta, Fiado, Producto])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
