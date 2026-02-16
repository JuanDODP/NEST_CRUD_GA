import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Res, UploadedFile, BadRequestException, UseInterceptors } from '@nestjs/common';
import { AreasService } from './areas.service';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter, fileNamer } from './helpers';
import { diskStorage } from 'multer';
import { ApiTags } from '@nestjs/swagger';
// @ApiTags('areas')
@Controller('areas')
export class AreasController {
  constructor(private readonly areasService: AreasService) { }

@Post()
@Auth()
  @UseInterceptors(FileInterceptor('imagen', {    
    fileFilter,
    storage:diskStorage({ 
      destination:'./static/areas',
       filename:fileNamer
    })
  }))
create(
  @Body() createAreaDto: CreateAreaDto,
 @UploadedFile() file: Express.Multer.File
) {
  //  if (!file) throw new BadRequestException('Imagen is required');

  return this.areasService.create(createAreaDto, file);
}
              
  @Get()
  findAll() {
    return this.areasService.findAll();
  }
  
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.areasService.findOne(+id);
  }

 @Patch(':id')
@Auth()
@UseInterceptors(FileInterceptor('imagen', { // Usamos 'imagen' para coincidir con tu POST
  fileFilter,
  storage: diskStorage({ 
    destination: './static/areas',
    filename: fileNamer
  })
}))
update(
  @Param('id', ParseIntPipe) id: string, 
  @Body() updateAreaDto: UpdateAreaDto,
  @UploadedFile() file: Express.Multer.File // El archivo es opcional aquí
) {
  return this.areasService.update(+id, updateAreaDto, file);
}

  @Delete(':id')
  @Auth()
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.areasService.remove(+id);
  }

  // Descargar excel 
  @Get('export/excel')
    async downloadExcel(@Res() res: any) {
  return await this.areasService.exportToExcel(res);
} 
}