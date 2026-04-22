import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Fiado } from './fiado.entity';

@Entity('pagos_fiado')
export class PagoFiado {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fiadoId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  monto: number;

  @Column({ nullable: true })
  notas: string;

  @CreateDateColumn()
  fecha: Date;

  @ManyToOne(() => Fiado, (fiado) => fiado.pagos)
  fiado: Fiado;
}
