import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

    // Obtener imagen de proyectos
  @Get('proyectos/:imageName')
  findProjectImage(@Res() res:any,
   @Param('imageName') imageName: string,  ) {
    const path = this.filesService.getStaticProjectImage(imageName, 'proyectos');
    // res.status(403).json({ok:false, path})
     // colocar url de la imagen
    // const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}`;
     res.sendFile(path);
     return path ; 
  }
  @Get('areas/:imageName')
  findAreaImage(@Res() res:any,
   @Param('imageName') imageName: string,  ) {
    const path = this.filesService.getStaticProjectImage(imageName, 'areas');
    // res.status(403).json({ok:false, path})
     // colocar url de la imagen
    // const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}`;
     res.sendFile(path);
     return path ; 
  }
   @Get('users/:imageName')
   findUserImage(@Res() res:any,
    @Param('imageName') imageName: string,  ) {
     const path = this.filesService.getStaticProjectImage(imageName, 'users');
     // res.status(403).json({ok:false, path})
      // colocar url de la imagen
     // const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}`;
      res.sendFile(path);
      return path ; 
   }
 
}
