import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
  ) {}

  findAll(userId: string) {
    return this.productoRepository.find({ where: { userId }, order: { nombre: 'ASC' } });
  }

  async findOne(id: string, userId: string) {
    const producto = await this.productoRepository.findOne({ where: { id, userId } });
    if (!producto) throw new NotFoundException('Producto no encontrado');
    return producto;
  }

  findStockBajo(userId: string) {
    return this.productoRepository
      .createQueryBuilder('p')
      .where('p.userId = :userId', { userId })
      .andWhere('p.stock <= p.stockMinimo')
      .getMany();
  }

  create(dto: CreateProductoDto, userId: string) {
    const producto = this.productoRepository.create({ ...dto, userId });
    return this.productoRepository.save(producto);
  }

  async update(id: string, dto: UpdateProductoDto, userId: string) {
    const producto = await this.findOne(id, userId);
    Object.assign(producto, dto);
    return this.productoRepository.save(producto);
  }

  async actualizarStock(id: string, cantidad: number, userId: string) {
    const producto = await this.findOne(id, userId);
    producto.stock = cantidad;
    return this.productoRepository.save(producto);
  }

  async remove(id: string, userId: string) {
    const producto = await this.findOne(id, userId);
    await this.productoRepository.remove(producto);
    return { message: 'Producto eliminado' };
  }
}
