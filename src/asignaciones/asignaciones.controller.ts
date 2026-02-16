import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { AsignacionesService } from './asignaciones.service';
import { CreateAsignacioneDto } from './dto/create-asignacione.dto';
import { UpdateAsignacioneDto } from './dto/update-asignacione.dto';
import { Auth } from 'src/auth/decorators';
import { Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('asignaciones')
@Controller('asignaciones')
export class AsignacionesController {
  constructor(private readonly asignacionesService: AsignacionesService) { }

  @Post()
  @Auth()
  create(@Body() createAsignacioneDto: CreateAsignacioneDto) {
    return this.asignacionesService.create(createAsignacioneDto);
  }

  @Get()
  findAll() {
    return this.asignacionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.asignacionesService.findOne(id);
  }


  @Patch(':id')
  @Auth()
  update(@Param('id', ParseIntPipe) id: number, @Body() updateAsignacioneDto: UpdateAsignacioneDto) {
    return this.asignacionesService.update(id, updateAsignacioneDto);
  }

  @Delete(':id')
  @Auth()
  remove(@Param('id',ParseIntPipe) id: number) {
    return this.asignacionesService.remove(id);
  }
  // generar pdf
@Get('pdf/:id')
async getPdf(
  @Param('id', ParseIntPipe) id: number,
  @Res() res: any // Inyectamos la respuesta de Express
) {
  const pdfBuffer = await this.asignacionesService.generatePdf(id);
  
  // Configuramos los headers para que el navegador lo identifique como PDF
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=asignacion_${id}.pdf`);
  
  return res.send(pdfBuffer);
}
}
