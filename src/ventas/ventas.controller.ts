import { Body, Controller, Delete, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { VentasService } from './ventas.service';
import { CreateVentaDto } from './dto/create-venta.dto';

@UseGuards(JwtAuthGuard)
@Controller('ventas')
export class VentasController {
  constructor(private ventasService: VentasService) {}

  @Get()
  findAll(@Request() req) {
    return this.ventasService.findAll(req.user.id);
  }

  @Get('hoy')
  findHoy(@Request() req) {
    return this.ventasService.findHoy(req.user.id);
  }

  @Post()
  create(@Body() dto: CreateVentaDto, @Request() req) {
    return this.ventasService.create(dto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.ventasService.remove(id, req.user.id);
  }
}
