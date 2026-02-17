import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Res, UploadedFile, BadRequestException, UseInterceptors } from '@nestjs/common';
import { AreasService } from './areas.service';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter, fileNamer } from './helpers';
import { diskStorage } from 'multer';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Area } from './entities/area.entity';

@ApiTags('areas')
@Controller('areas')
export class AreasController {
  constructor(private readonly areasService: AreasService) { }

  @Post()
  @Auth()
  @ApiOperation({ summary: 'Crear una nueva área con imagen' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Área creada con éxito.', type: Area })
  @ApiResponse({ status: 400, description: 'Faltan datos o formato de archivo inválido.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @UseInterceptors(FileInterceptor('imagen', {
    fileFilter,
    storage: diskStorage({
      destination: './static/areas',
      filename: fileNamer
    })
  }))
  create(
    @Body() createAreaDto: CreateAreaDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.areasService.create(createAreaDto, file);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener lista de todas las áreas' })
  @ApiResponse({ status: 200, type: [Area] })
  findAll() {
    return this.areasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un área por su ID' })
  @ApiResponse({ status: 200, type: Area })

  @ApiResponse({ status: 404, description: 'Área no encontrada.' })

  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.areasService.findOne(+id);
  }

  @Patch(':id')
  @Auth()
  @ApiOperation({ summary: 'Actualizar área e imagen por ID' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, description: 'Área actualizada.', type: Area })
  @ApiResponse({ status: 401, description: 'No autorizado.' })

  @ApiResponse({ status: 404, description: 'Área no encontrada.' })

  @UseInterceptors(FileInterceptor('imagen', {
    fileFilter,
    storage: diskStorage({
      destination: './static/areas',
      filename: fileNamer
    })
  }))
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateAreaDto: UpdateAreaDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.areasService.update(+id, updateAreaDto, file);
  }

  @Delete(':id')
  @Auth()
  @ApiOperation({ summary: 'Eliminar un área' })
  @ApiResponse({ status: 200, description: 'Área eliminada correctamente.' })
  @ApiResponse({ status: 400, description: 'No se puede eliminar el área porque tiene registros relacionados (proyectos).' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })

  @ApiResponse({ status: 404, description: 'Área no encontrada.' })
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.areasService.remove(+id);
  }

  @Get('export/excel')
  @ApiOperation({ summary: 'Exportar áreas a un archivo Excel' })
  @ApiResponse({ 
    status: 200, 
    description: 'Archivo Excel generado',
    content: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {} }
  })
  async downloadExcel(@Res() res: any) {
    return await this.areasService.exportToExcel(res);
  }
}