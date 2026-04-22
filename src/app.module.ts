import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ClientesModule } from './clientes/clientes.module';
import { ProductosModule } from './productos/productos.module';
import { FiadosModule } from './fiados/fiados.module';
import { VentasModule } from './ventas/ventas.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { User } from './auth/entities/user.entity';
import { Cliente } from './clientes/entities/cliente.entity';
import { Producto } from './productos/entities/producto.entity';
import { Fiado } from './fiados/entities/fiado.entity';
import { PagoFiado } from './fiados/entities/pago-fiado.entity';
import { Venta } from './ventas/entities/venta.entity';
import { VentaDetalle } from './ventas/entities/venta-detalle.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      entities: [User, Cliente, Producto, Fiado, PagoFiado, Venta, VentaDetalle],
      synchronize: true,
    }),
    AuthModule,
    ClientesModule,
    ProductosModule,
    FiadosModule,
    VentasModule,
    DashboardModule,
  ],
})
export class AppModule {}
