import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Res } from '@nestjs/common';
import { AsignacionesService } from './asignaciones.service';
import { CreateAsignacioneDto } from './dto/create-asignacione.dto';
import { UpdateAsignacioneDto } from './dto/update-asignacione.dto';
import { Auth } from 'src/auth/decorators';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Asignacion } from './entities/asignacione.entity';

@ApiTags('asignaciones')
@Controller('asignaciones')
export class AsignacionesController {
  constructor(private readonly asignacionesService: AsignacionesService) { }

  @Post()
  @ApiOperation({ summary: 'Crear una nueva asignación' })
  @ApiResponse({ status: 201, description: 'Asignación creada con éxito.', type: Asignacion })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @Auth()
  create(@Body() createAsignacioneDto: CreateAsignacioneDto) {
    return this.asignacionesService.create(createAsignacioneDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las asignaciones' })
  @ApiResponse({ status: 200, description: 'Lista de asignaciones.', type: [Asignacion] })
  findAll() {
    return this.asignacionesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una asignación por ID' })
  @ApiResponse({ status: 200, description: 'Asignación encontrada.', type: Asignacion })
  @ApiResponse({ status: 404, description: 'Asignación no encontrada.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.asignacionesService.findOne(id);
  }

  @Patch(':id')
  @Auth()
  @ApiOperation({ summary: 'Actualizar una asignación existente' })
  @ApiResponse({ status: 200, description: 'Asignación actualizada.', type: Asignacion })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 404, description: 'Asignación no encontrada.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateAsignacioneDto: UpdateAsignacioneDto) {
    return this.asignacionesService.update(id, updateAsignacioneDto);
  }

  @Delete(':id')
  @Auth()
  @ApiOperation({ summary: 'Eliminar una asignación' })
  @ApiResponse({ status: 200, description: 'Asignación eliminada correctamente.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 404, description: 'Asignación no encontrada.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.asignacionesService.remove(id);
  }

  @Get('pdf/:id')
  @ApiOperation({ summary: 'Generar y descargar comprobante de asignación en PDF' })
  @ApiResponse({
    status: 200,
    description: 'Archivo PDF de la asignación',
    content: { 'application/pdf': {} }
  })
  @ApiResponse({ status: 404, description: 'Asignación no encontrada.' })
  async getPdf(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: any
  ) {
    const pdfBuffer = await this.asignacionesService.generatePdf(id);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=asignacion_${id}.pdf`);

    return res.send(pdfBuffer);
  }
}