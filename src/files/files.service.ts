import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';
@Injectable()
export class FilesService {

    getStaticProjectImage(imageName: string, foldername: string) {
      const path = join(__dirname, '../../static', foldername, imageName);

      if (!existsSync(path)) {
        throw new BadRequestException('Image not found ' + imageName);
      }
  
      return path;
  
    }
}
