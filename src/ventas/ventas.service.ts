import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Venta } from './entities/venta.entity';
import { VentaDetalle } from './entities/venta-detalle.entity';
import { Producto } from '../productos/entities/producto.entity';
import { CreateVentaDto } from './dto/create-venta.dto';

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Venta)
    private ventaRepository: Repository<Venta>,
    @InjectRepository(VentaDetalle)
    private detalleRepository: Repository<VentaDetalle>,
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
    private dataSource: DataSource,
  ) {}

  findAll(userId: string) {
    return this.ventaRepository.find({
      where: { userId },
      relations: ['cliente', 'detalles', 'detalles.producto'],
      order: { fecha: 'DESC' },
    });
  }

  findHoy(userId: string) {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return this.ventaRepository
      .createQueryBuilder('v')
      .leftJoinAndSelect('v.cliente', 'c')
      .leftJoinAndSelect('v.detalles', 'd')
      .leftJoinAndSelect('d.producto', 'p')
      .where('v.userId = :userId', { userId })
      .andWhere('v.fecha >= :hoy', { hoy })
      .orderBy('v.fecha', 'DESC')
      .getMany();
  }

  async create(dto: CreateVentaDto, userId: string) {
    return this.dataSource.transaction(async (manager) => {
      let total = 0;
      const detallesEntidades: VentaDetalle[] = [];

      for (const item of dto.detalles) {
        const producto = await manager.findOne(Producto, {
          where: { id: item.productoId, userId },
        });
        if (!producto) throw new NotFoundException(`Producto ${item.productoId} no encontrado`);
        if (producto.stock < item.cantidad) {
          throw new BadRequestException(
            `Stock insuficiente para "${producto.nombre}". Disponible: ${producto.stock}`,
          );
        }

        const subtotal = item.cantidad * item.precioUnitario;
        total += subtotal;

        producto.stock -= item.cantidad;
        await manager.save(Producto, producto);

        const detalle = manager.create(VentaDetalle, {
          productoId: item.productoId,
          cantidad: item.cantidad,
          precioUnitario: item.precioUnitario,
          subtotal,
        });
        detallesEntidades.push(detalle);
      }

      const venta = manager.create(Venta, {
        userId,
        clienteId: dto.clienteId,
        tipo: dto.tipo,
        notas: dto.notas,
        total,
        detalles: detallesEntidades,
      });

      return manager.save(Venta, venta);
    });
  }

  async remove(id: string, userId: string) {
    const venta = await this.ventaRepository.findOne({ where: { id, userId } });
    if (!venta) throw new NotFoundException('Venta no encontrada');
    await this.ventaRepository.remove(venta);
    return { message: 'Venta eliminada' };
  }
}
