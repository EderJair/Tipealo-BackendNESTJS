import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Cliente } from '../../clientes/entities/cliente.entity';
import { VentaDetalle } from './venta-detalle.entity';

export enum TipoVenta {
  CONTADO = 'CONTADO',
  FIADO = 'FIADO',
}

@Entity('ventas')
export class Venta {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column({ nullable: true })
  clienteId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({ type: 'enum', enum: TipoVenta, default: TipoVenta.CONTADO })
  tipo: TipoVenta;

  @Column({ nullable: true })
  notas: string;

  @CreateDateColumn()
  fecha: Date;

  @ManyToOne(() => User, (user) => user.ventas)
  user: User;

  @ManyToOne(() => Cliente, (cliente) => cliente.ventas, { nullable: true })
  cliente: Cliente;

  @OneToMany(() => VentaDetalle, (detalle) => detalle.venta, { cascade: true })
  detalles: VentaDetalle[];
}
