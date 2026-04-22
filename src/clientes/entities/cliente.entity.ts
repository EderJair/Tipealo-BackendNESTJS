import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Fiado } from '../../fiados/entities/fiado.entity';
import { Venta } from '../../ventas/entities/venta.entity';

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  telefono: string;

  @Column({ nullable: true })
  direccion: string;

  @Column({ nullable: true })
  notas: string;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.clientes)
  user: User;

  @OneToMany(() => Fiado, (fiado) => fiado.cliente)
  fiados: Fiado[];

  @OneToMany(() => Venta, (venta) => venta.cliente)
  ventas: Venta[];
}
