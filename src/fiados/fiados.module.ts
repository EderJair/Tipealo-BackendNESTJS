import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FiadosController } from './fiados.controller';
import { FiadosService } from './fiados.service';
import { Fiado } from './entities/fiado.entity';
import { PagoFiado } from './entities/pago-fiado.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Fiado, PagoFiado])],
  controllers: [FiadosController],
  providers: [FiadosService],
})
export class FiadosModule {}
