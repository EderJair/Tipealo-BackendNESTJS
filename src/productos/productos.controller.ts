import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@UseGuards(JwtAuthGuard)
@Controller('productos')
export class ProductosController {
  constructor(private productosService: ProductosService) {}

  @Get()
  findAll(@Request() req) {
    return this.productosService.findAll(req.user.id);
  }

  @Get('stock-bajo')
  stockBajo(@Request() req) {
    return this.productosService.findStockBajo(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.productosService.findOne(id, req.user.id);
  }

  @Post()
  create(@Body() dto: CreateProductoDto, @Request() req) {
    return this.productosService.create(dto, req.user.id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductoDto, @Request() req) {
    return this.productosService.update(id, dto, req.user.id);
  }

  @Patch(':id/stock')
  actualizarStock(@Param('id') id: string, @Body('stock') stock: number, @Request() req) {
    return this.productosService.actualizarStock(id, stock, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.productosService.remove(id, req.user.id);
  }
}
