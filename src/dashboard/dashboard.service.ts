import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venta } from '../ventas/entities/venta.entity';
import { Fiado, EstadoFiado } from '../fiados/entities/fiado.entity';
import { Producto } from '../productos/entities/producto.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Venta)
    private ventaRepository: Repository<Venta>,
    @InjectRepository(Fiado)
    private fiadoRepository: Repository<Fiado>,
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
  ) {}

  async getDashboard(userId: string) {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

    // Auto-marcar fiados vencidos
    await this.fiadoRepository
      .createQueryBuilder()
      .update(Fiado)
      .set({ estado: EstadoFiado.VENCIDO })
      .where('userId = :userId', { userId })
      .andWhere('estado = :estado', { estado: EstadoFiado.PENDIENTE })
      .andWhere('fechaVencimiento <= :hoy', { hoy: new Date() })
      .execute();

    const [ventasHoy, ventasMes, fiadosPendientes, fiadosVencidos, productosStockBajo] =
      await Promise.all([
        this.ventaRepository
          .createQueryBuilder('v')
          .select('COALESCE(SUM(v.total), 0)', 'total')
          .addSelect('COUNT(v.id)', 'cantidad')
          .where('v.userId = :userId', { userId })
          .andWhere('v.fecha >= :hoy', { hoy })
          .getRawOne(),

        this.ventaRepository
          .createQueryBuilder('v')
          .select('COALESCE(SUM(v.total), 0)', 'total')
          .addSelect('COUNT(v.id)', 'cantidad')
          .where('v.userId = :userId', { userId })
          .andWhere('v.fecha >= :primerDia', { primerDia: primerDiaMes })
          .getRawOne(),

        this.fiadoRepository.count({
          where: { userId, estado: EstadoFiado.PENDIENTE },
        }),

        this.fiadoRepository.count({
          where: { userId, estado: EstadoFiado.VENCIDO },
        }),

        this.productoRepository
          .createQueryBuilder('p')
          .where('p.userId = :userId', { userId })
          .andWhere('p.stock <= p.stockMinimo')
          .getCount(),
      ]);

    return {
      ventas: {
        hoy: {
          total: parseFloat(ventasHoy.total),
          cantidad: parseInt(ventasHoy.cantidad),
        },
        mes: {
          total: parseFloat(ventasMes.total),
          cantidad: parseInt(ventasMes.cantidad),
        },
      },
      fiados: {
        pendientes: fiadosPendientes,
        vencidos: fiadosVencidos,
      },
      alertas: {
        stockBajo: productosStockBajo,
        fiadosVencidos: fiadosVencidos,
      },
    };
  }
}
