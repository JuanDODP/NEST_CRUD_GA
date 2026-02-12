import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Res, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { ProyectosService } from './proyectos.service';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';
import { Auth } from 'src/auth/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileNamer, fileFilter } from './../utils/helpers'

@Controller('proyectos')
export class ProyectosController {
  constructor(private readonly proyectosService: ProyectosService) { }

  @Post()
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

    if (!file) throw new BadRequestException('Imagen is required');
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

  update(@Param('id', ParseIntPipe) id: number, @Body() updateProyectoDto: UpdateProyectoDto) {
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



  //   // Obtener imagen de producto
  // @Get('file/:imageName')
  // findProductImage(@Res() res:any,
  //  @Param('imageName') imageName: string,  ) {
  //   const path = this.proyectosService.getStaticProductImage(imageName);
  //   // res.status(403).json({ok:false, path})
  //    // colocar url de la imagen
  //   // const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}`;
  //    res.sendFile(path);
  //    return path ; 
  // }
}
