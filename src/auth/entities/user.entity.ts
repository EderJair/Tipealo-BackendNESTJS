import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Cliente } from '../../clientes/entities/cliente.entity';
import { Producto } from '../../productos/entities/producto.entity';
import { Fiado } from '../../fiados/entities/fiado.entity';
import { Venta } from '../../ventas/entities/venta.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Cliente, (cliente) => cliente.user)
  clientes: Cliente[];

  @OneToMany(() => Producto, (producto) => producto.user)
  productos: Producto[];

  @OneToMany(() => Fiado, (fiado) => fiado.user)
  fiados: Fiado[];

  @OneToMany(() => Venta, (venta) => venta.user)
  ventas: Venta[];
}
