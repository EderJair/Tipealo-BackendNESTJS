import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@UseGuards(JwtAuthGuard)
@Controller('clientes')
export class ClientesController {
  constructor(private clientesService: ClientesService) {}

  @Get()
  findAll(@Request() req) {
    return this.clientesService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.clientesService.findOne(id, req.user.id);
  }

  @Post()
  create(@Body() dto: CreateClienteDto, @Request() req) {
    return this.clientesService.create(dto, req.user.id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateClienteDto, @Request() req) {
    return this.clientesService.update(id, dto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.clientesService.remove(id, req.user.id);
  }
}
