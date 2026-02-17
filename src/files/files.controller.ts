import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @ApiOperation({ summary: 'Obtener imagen de un proyecto' })
  @ApiResponse({ 
    status: 200, 
    description: 'Devuelve el archivo de imagen del proyecto',
    content: { 'image/png': {}, 'image/jpeg': {} } 
  })
  @Get('proyectos/:imageName')
  findProjectImage(
    @Res() res: any,
    @Param('imageName') imageName: string,
  ) {
    const path = this.filesService.getStaticProjectImage(imageName, 'proyectos');
    res.sendFile(path);
  }

  @ApiOperation({ summary: 'Obtener imagen de un área' })
  @ApiResponse({ 
    status: 200, 
    description: 'Devuelve el archivo de imagen del área',
    content: { 'image/png': {}, 'image/jpeg': {} } 
  })
  @Get('areas/:imageName')
  findAreaImage(
    @Res() res: any,
    @Param('imageName') imageName: string,
  ) {
    const path = this.filesService.getStaticProjectImage(imageName, 'areas');
    res.sendFile(path);
  }

  @ApiOperation({ summary: 'Obtener imagen de un usuario' })
  @ApiResponse({ 
    status: 200, 
    description: 'Devuelve el archivo de imagen de perfil del usuario',
    content: { 'image/png': {}, 'image/jpeg': {} } 
  })
  @Get('users/:imageName')
  findUserImage(
    @Res() res: any,
    @Param('imageName') imageName: string,
  ) {
    const path = this.filesService.getStaticProjectImage(imageName, 'users');
    res.sendFile(path);
  }
}