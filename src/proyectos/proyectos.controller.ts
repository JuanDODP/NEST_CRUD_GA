import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Res } from '@nestjs/common';
import { ProyectosService } from './proyectos.service';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';
import { Auth } from 'src/auth/decorators';

@Controller('proyectos')
export class ProyectosController {
  constructor(private readonly proyectosService: ProyectosService) { }

  @Post()
  @Auth()
  create(@Body() createProyectoDto: CreateProyectoDto) {
    return this.proyectosService.create(createProyectoDto);
  }

  @Get()
  findAll() {
    return this.proyectosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.proyectosService.findOne(id);
  }

  @Patch(':id')
  @Auth()

  update(@Param('id',ParseIntPipe) id: number, @Body() updateProyectoDto: UpdateProyectoDto) {
    return this.proyectosService.update(id, updateProyectoDto);
  }

  @Delete(':id')
  @Auth()

  remove(@Param('id', ParseIntPipe) id: number) {
    return this.proyectosService.remove(id);
  }
  // descargarExcel
    @Get('export/excel')
      async downloadExcel(@Res() res: any) {
    return await this.proyectosService.exportToExcel(res);
  } 
}
