import { Body, Controller, Delete, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FiadosService } from './fiados.service';
import { CreateFiadoDto } from './dto/create-fiado.dto';
import { PagarFiadoDto } from './dto/pagar-fiado.dto';

@UseGuards(JwtAuthGuard)
@Controller('fiados')
export class FiadosController {
  constructor(private fiadosService: FiadosService) {}

  @Get()
  findAll(@Request() req) {
    return this.fiadosService.findAll(req.user.id);
  }

  @Get('pendientes')
  findPendientes(@Request() req) {
    return this.fiadosService.findPendientes(req.user.id);
  }

  @Get('vencidos')
  findVencidos(@Request() req) {
    return this.fiadosService.findVencidos(req.user.id);
  }

  @Post()
  create(@Body() dto: CreateFiadoDto, @Request() req) {
    return this.fiadosService.create(dto, req.user.id);
  }

  @Post(':id/pagar')
  pagar(@Param('id') id: string, @Body() dto: PagarFiadoDto, @Request() req) {
    return this.fiadosService.pagar(id, dto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.fiadosService.remove(id, req.user.id);
  }
}
