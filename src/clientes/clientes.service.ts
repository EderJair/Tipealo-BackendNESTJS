import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './entities/cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private clienteRepository: Repository<Cliente>,
  ) {}

  findAll(userId: string) {
    return this.clienteRepository.find({ where: { userId }, order: { nombre: 'ASC' } });
  }

  async findOne(id: string, userId: string) {
    const cliente = await this.clienteRepository.findOne({ where: { id, userId } });
    if (!cliente) throw new NotFoundException('Cliente no encontrado');
    return cliente;
  }

  create(dto: CreateClienteDto, userId: string) {
    const cliente = this.clienteRepository.create({ ...dto, userId });
    return this.clienteRepository.save(cliente);
  }

  async update(id: string, dto: UpdateClienteDto, userId: string) {
    const cliente = await this.findOne(id, userId);
    Object.assign(cliente, dto);
    return this.clienteRepository.save(cliente);
  }

  async remove(id: string, userId: string) {
    const cliente = await this.findOne(id, userId);
    await this.clienteRepository.remove(cliente);
    return { message: 'Cliente eliminado' };
  }
}
