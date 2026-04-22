import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Cliente } from '../../clientes/entities/cliente.entity';
import { PagoFiado } from './pago-fiado.entity';

export enum EstadoFiado {
  PENDIENTE = 'PENDIENTE',
  PAGADO = 'PAGADO',
  VENCIDO = 'VENCIDO',
}

@Entity('fiados')
export class Fiado {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  clienteId: string;

  @Column()
  userId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  monto: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  montoPagado: number;

  @Column({ type: 'date', nullable: true })
  fechaVencimiento: Date;

  @Column({ type: 'enum', enum: EstadoFiado, default: EstadoFiado.PENDIENTE })
  estado: EstadoFiado;

  @Column({ nullable: true })
  notas: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.fiados)
  user: User;

  @ManyToOne(() => Cliente, (cliente) => cliente.fiados)
  cliente: Cliente;

  @OneToMany(() => PagoFiado, (pago) => pago.fiado, { cascade: true })
  pagos: PagoFiado[];
}
