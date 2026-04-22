import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Venta } from './venta.entity';
import { Producto } from '../../productos/entities/producto.entity';

@Entity('venta_detalles')
export class VentaDetalle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  ventaId: string;

  @Column()
  productoId: string;

  @Column()
  cantidad: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precioUnitario: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @ManyToOne(() => Venta, (venta) => venta.detalles)
  venta: Venta;

  @ManyToOne(() => Producto, (producto) => producto.ventaDetalles)
  producto: Producto;
}
