import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Res, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ProyectosService } from './proyectos.service';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';
import { Auth } from 'src/auth/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileNamer, fileFilter } from './../utils/helpers'
import { ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Proyecto } from './entities/proyecto.entity';

@ApiTags('proyectos')
@Controller('proyectos')
export class ProyectosController {
  constructor(private readonly proyectosService: ProyectosService) { }

  @Post()
  @Auth()
  @ApiOperation({ summary: 'Crear un nuevo proyecto con imagen' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Proyecto creado con éxito.', type: Proyecto })
  @ApiResponse({ status: 400, description: 'Datos inválidos o archivo no permitido.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })

  @UseInterceptors(FileInterceptor('imagen', {
    fileFilter,
    storage: diskStorage({
      destination: './static/proyectos',
      filename: fileNamer
    })
  }))
  create(
    @Body() createProyectoDto: CreateProyectoDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.proyectosService.create(createProyectoDto, file);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los proyectos' })
  @ApiResponse({ status: 200, type: [Proyecto] })
  findAll() {
    return this.proyectosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un proyecto por su ID' })
  @ApiResponse({ status: 200, type: Proyecto })
  @ApiResponse({ status: 404, description: 'Proyecto no encontrado.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.proyectosService.findOne(id);
  }

  @Patch(':id')
  @Auth()
  @ApiOperation({ summary: 'Actualizar un proyecto existente e imagen' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, description: 'Proyecto actualizado.', type: Proyecto })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 404, description: 'Proyecto no encontrado.' })

  @UseInterceptors(FileInterceptor('imagen', {
    fileFilter,
    storage: diskStorage({
      destination: './static/proyectos',
      filename: fileNamer
    })
  }))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProyectoDto: UpdateProyectoDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    return this.proyectosService.update(id, updateProyectoDto, file);
  }

  @Delete(':id')
  @Auth()
  @ApiOperation({ summary: 'Eliminar un proyecto' })
  @ApiResponse({ status: 200, description: 'Proyecto eliminado correctamente.' })
  @ApiResponse({ status: 400, description: 'No se puede eliminar el proyecto porque tiene registros relacionados (asignaciones).' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 404, description: 'Proyecto no encontrado.' })

  remove(@Param('id', ParseIntPipe) id: number) {
    return this.proyectosService.remove(id);
  }

  @Get('export/excel')
  @ApiOperation({ summary: 'Exportar lista de proyectos a Excel' })
  @ApiResponse({
    status: 200,
    description: 'Archivo Excel generado',
    content: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {} }
  })
  async downloadExcel(@Res() res: any) {
    return await this.proyectosService.exportToExcel(res);
  }
}