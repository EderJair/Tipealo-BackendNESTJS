import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository } from 'typeorm';
import { Fiado, EstadoFiado } from './entities/fiado.entity';
import { PagoFiado } from './entities/pago-fiado.entity';
import { CreateFiadoDto } from './dto/create-fiado.dto';
import { PagarFiadoDto } from './dto/pagar-fiado.dto';

@Injectable()
export class FiadosService {
  constructor(
    @InjectRepository(Fiado)
    private fiadoRepository: Repository<Fiado>,
    @InjectRepository(PagoFiado)
    private pagoRepository: Repository<PagoFiado>,
  ) {}

  findAll(userId: string) {
    return this.fiadoRepository.find({
      where: { userId },
      relations: ['cliente', 'pagos'],
      order: { createdAt: 'DESC' },
    });
  }

  findPendientes(userId: string) {
    this.autoActualizarVencidos(userId);
    return this.fiadoRepository.find({
      where: { userId, estado: EstadoFiado.PENDIENTE },
      relations: ['cliente'],
      order: { fechaVencimiento: 'ASC' },
    });
  }

  async findVencidos(userId: string) {
    await this.autoActualizarVencidos(userId);
    return this.fiadoRepository.find({
      where: { userId, estado: EstadoFiado.VENCIDO },
      relations: ['cliente'],
      order: { fechaVencimiento: 'ASC' },
    });
  }

  create(dto: CreateFiadoDto, userId: string) {
    const fiado = this.fiadoRepository.create({ ...dto, userId, montoPagado: 0 });
    return this.fiadoRepository.save(fiado);
  }

  async pagar(id: string, dto: PagarFiadoDto, userId: string) {
    const fiado = await this.fiadoRepository.findOne({
      where: { id, userId },
      relations: ['pagos'],
    });
    if (!fiado) throw new NotFoundException('Fiado no encontrado');
    if (fiado.estado === EstadoFiado.PAGADO) {
      throw new BadRequestException('Este fiado ya está pagado');
    }

    const pago = this.pagoRepository.create({ fiadoId: id, ...dto });
    await this.pagoRepository.save(pago);

    fiado.montoPagado = Number(fiado.montoPagado) + Number(dto.monto);
    if (fiado.montoPagado >= Number(fiado.monto)) {
      fiado.estado = EstadoFiado.PAGADO;
    }

    return this.fiadoRepository.save(fiado);
  }

  async remove(id: string, userId: string) {
    const fiado = await this.fiadoRepository.findOne({ where: { id, userId } });
    if (!fiado) throw new NotFoundException('Fiado no encontrado');
    await this.fiadoRepository.remove(fiado);
    return { message: 'Fiado eliminado' };
  }

  private async autoActualizarVencidos(userId: string) {
    const hoy = new Date();
    await this.fiadoRepository
      .createQueryBuilder()
      .update(Fiado)
      .set({ estado: EstadoFiado.VENCIDO })
      .where('userId = :userId', { userId })
      .andWhere('estado = :estado', { estado: EstadoFiado.PENDIENTE })
      .andWhere('fechaVencimiento <= :hoy', { hoy })
      .execute();
  }
}
