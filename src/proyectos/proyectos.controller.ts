import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Res, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { ProyectosService } from './proyectos.service';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';
import { Auth } from 'src/auth/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileNamer, fileFilter } from './../utils/helpers'
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Proyecto } from './entities/proyecto.entity';
@ApiTags('proyectos')
@Controller('proyectos')
export class ProyectosController {
  constructor(private readonly proyectosService: ProyectosService) { }

  @Post()
  @ApiTags('proyectos')
  @ApiResponse({ status: 201, description: 'The proyecto has been successfully created.', type: Proyecto })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Auth()
  @UseInterceptors(FileInterceptor('imagen', {
    fileFilter,
    storage: diskStorage({
      destination: './static/proyectos',
      filename: fileNamer
    })
  }))
  create(@Body() createProyectoDto: CreateProyectoDto,

    @UploadedFile() file: Express.Multer.File) {

    // if (!file) throw new BadRequestException('Imagen is required');
    return this.proyectosService.create(createProyectoDto, file);
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

  @Patch(':id')
  @Auth()
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
    @UploadedFile() file?: Express.Multer.File // El archivo ahora es opcional en el update
  ) {
    return this.proyectosService.update(id, updateProyectoDto, file);
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
