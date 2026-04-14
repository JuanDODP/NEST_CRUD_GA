import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Area } from './entities/area.entity';
import { Repository } from 'typeorm';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AreasService {
  private readonly logger = new Logger('AreasService');
  constructor(
    @InjectRepository(Area)
    private readonly areasRepository: Repository<Area>,
     private readonly configService: ConfigService,
  ) {
  }

  async create(createAreaDto: CreateAreaDto, file: Express.Multer.File) {
  const fileName = file ? file.filename : '59550600-41e9-4fa1-9718-a1b4c85c85a9.png';
    try {
      const area = this.areasRepository.create({
        ...createAreaDto,
        imagen: fileName // Guardamos solo el nombre
      });

      await this.areasRepository.save(area);

      return {
        ok: true,
        area: {
          ...area,
         imagen: file 
          ? `${this.configService.get('HOST_API')}/files/areas/${file.filename}` 
          : `${this.configService.get('HOST_API')}/files/areas/59550600-41e9-4fa1-9718-a1b4c85c85a9.png`

        }
      };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll() {
    try {
      const areas = await this.areasRepository.find();
      return {
        ok: true,
        areas
      };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findOne(id: number) {
    const area = await this.areasRepository.findOneBy({ id });

    if (!area) {
      throw new NotFoundException(`Area with id ${id} not found`);
    }

    return {
      ok: true,
      area
    };
  }

async update(id: number, updateAreaDto: UpdateAreaDto, file?: Express.Multer.File) {
  
  // 1. Preparamos el objeto para actualizar
  const area = await this.areasRepository.preload({
    id: id,
    ...updateAreaDto,
  });

  if (!area) throw new NotFoundException(`Area with id ${id} not found`);

  // 2. Si el usuario subió una nueva imagen, actualizamos el nombre del archivo
   if (file) {
      area.imagen = file.filename;
    }

  try {
    await this.areasRepository.save(area);
    
    // 3. Retornamos el área con la URL completa para el frontend
    return {
      ok: true,
      area: {
        ...area,
        imagen: file 
          ? `${this.configService.get('HOST_API')}/files/areas/${file.filename}` 
          : area.imagen.startsWith('http') 
            ? area.imagen 
            : `${this.configService.get('HOST_API')}/files/areas/${area.imagen}`
      }
    };
  } catch (error) {
    this.handleDBExceptions(error);
  }
}

  async remove(id: number) {
    const area = await this.areasRepository.findOne({ where: { id } });
    if (!area) {
      throw new NotFoundException(`Area with id ${id} not found`);
    }
    try {
      await this.areasRepository.remove(area);
      return {
        ok: true,
        message: `Area with id "${id}" has been removed`
      };
    } catch (error) {
      // --- CAMBIO PARA SQL SERVER ---
      // El código 547 corresponde a conflictos de Foreign Key (instrucción REFERENCE)
      if (error.number === 547) {
        throw new BadRequestException(
          `No se puede eliminar el área porque tiene registros relacionados (proyectos).`
        );
      }
      this.handleDBExceptions(error);
    }
  }

  // descargarExcel
  async exportToExcel(res: Response) {
    // 1. Obtener todos los datos de SQL Server
    const areas = await this.areasRepository.find();

    // 2. Crear el libro y la hoja de Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Areas');

    // 3. Definir las columnas
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Nombre', key: 'nombre', width: 30 },
      { header: 'Descripción', key: 'description', width: 50 },
    ];

    // 4. Agregar las filas
    worksheet.addRows(areas);

    // 5. Configurar la respuesta para que el navegador descargue el archivo
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=' + 'areas_reporte.xlsx',
    );

    // 6. Escribir el archivo en el stream de respuesta
    await workbook.xlsx.write(res);
    res.end();
  }
  // =============================================================================================================================

private handleDBExceptions(error: any) {
  // --- CAMBIO PARA POSTGRESQL ---
  // El código '23505' es para violaciones de restricción UNIQUE (Unique Violation)
  if (error.code === '23505') {
    throw new BadRequestException(error.detail || 'El registro ya existe en la base de datos');
  }

  // El código '23503' es para violaciones de llave foránea (Foreign Key Violation)
  // Útil si intentas borrar un área que tiene proyectos asignados o viceversa
  if (error.code === '23503') {
    throw new BadRequestException('Operación no permitida: existen registros relacionados');
  }

  this.logger.error(error);
  throw new InternalServerErrorException('No se pudo procesar la solicitud - Revisa los logs del servidor');
}
}