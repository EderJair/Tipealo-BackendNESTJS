import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { VentaDetalle } from '../../ventas/entities/venta-detalle.entity';

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  descripcion: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio: number;

  @Column({ default: 0 })
  stock: number;

  @Column({ default: 5 })
  stockMinimo: number;

  @Column({ nullable: true })
  unidad: string;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.productos)
  user: User;

  @OneToMany(() => VentaDetalle, (detalle) => detalle.producto)
  ventaDetalles: VentaDetalle[];
}
