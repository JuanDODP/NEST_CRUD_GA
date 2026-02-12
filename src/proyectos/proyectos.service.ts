import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Proyecto } from './entities/proyecto.entity';
import { DataSource, Repository } from 'typeorm';
import { AreasService } from '../areas/areas.service';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';
import { existsSync } from 'fs';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class ProyectosService {
  private readonly logger = new Logger('ProyectosService');

  constructor(
    @InjectRepository(Proyecto)
    private proyectosRepository: Repository<Proyecto>,
    private areasService: AreasService,
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,

  ) { }

  async create(createProyectoDto: CreateProyectoDto, file: Express.Multer.File) {

    if (!file) throw new BadRequestException('Imagen is required');
    const { idArea, ...proyectosData } = createProyectoDto;

    // Buscamos el área
    const { area } = await this.areasService.findOne(idArea);

    if (!area) {
      throw new NotFoundException(`Area with id ${idArea} not found`);
    }

    try {
      const proyect = this.proyectosRepository.create({
        ...proyectosData,
        imagen: `${this.configService.get('HOST_API')}/files/proyectos/${file.filename}`, // Retornamos URL completa
        area: area
      });

      await this.proyectosRepository.save(proyect);

      return {
        ok: true,
        proyect
      };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll() {
    try {
      const proyectos = await this.proyectosRepository.find({
        relations: ['area']
      });
      return {
        ok: true,
        proyectos
      };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findOne(id: number) {
    const proyecto = await this.proyectosRepository.findOne({
      where: { id },
      relations: ['area'],
    });

    if (!proyecto) {
      throw new NotFoundException(`Proyecto with id ${id} not found`);
    }

    return {
      ok: true,
      proyecto
    };
  }

async update(id: number, updateProyectoDto: UpdateProyectoDto, file?: Express.Multer.File) {
    // 1. Buscamos el proyecto existente
    const { proyecto: proyectoExistente } = await this.findOne(id);

    const { idArea, ...datosActualizar } = updateProyectoDto;

    // 2. Si cambian el Área, verificamos que exista
    if (idArea) {
      const { area } = await this.areasService.findOne(idArea);
      if (!area) throw new NotFoundException(`Area with id ${idArea} not found`);
      proyectoExistente.area = area;
    }

    // 3. Si subieron una nueva imagen, actualizamos la URL
    if (file) {
      proyectoExistente.imagen = `${this.configService.get('HOST_API')}/files/proyectos/${file.filename}`;
    }

    try {
      // 4. Fusionamos los cambios de texto (título, precio, etc.)
      const proyectoActualizado = this.proyectosRepository.merge(proyectoExistente, datosActualizar);
      
      await this.proyectosRepository.save(proyectoActualizado);

      return {
        ok: true,
        proyecto: proyectoActualizado
      };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: number) {
    const { proyecto } = await this.findOne(id);

    try {
      await this.proyectosRepository.remove(proyecto);
      return {
        ok: true,
        message: `Proyecto with id ${id} removed successfully`
      };
    } catch (error) {
      // CAMBIO PARA SQL SERVER: Error 547 es violación de Foreign Key (instrucción REFERENCE)
      if (error.number === 547) {
        throw new BadRequestException(
          `No se puede eliminar el proyecto porque tiene asignaciones activas. Elimina las asignaciones primero.`
        );
      }
      this.handleDBExceptions(error);
    }
  }
  // descargarExcel
  // async exportToExcel(res: Response) {
  //   // 1. Obtener todos los datos de SQL Server
  //   const proyectos = await this.proyectosRepository.find();

  //   // 2. Crear el libro y la hoja de Excel
  //   const workbook = new ExcelJS.Workbook();
  //   const worksheet = workbook.addWorksheet('Proyectos');

  //   // 3. Definir las columnas
  //   worksheet.columns = [
  //     { header: 'ID', key: 'id', width: 10 },
  //     { header: 'Nombre del Proyecto', key: 'nombreProyecto', width: 35 },
  //     { header: 'Fecha de Inicio', key: 'fechaInicio', width: 20 },
  //     { header: 'Fecha de Fin', key: 'fechaFin', width: 20 },
  //     { header: 'Área Asignada', key: 'areaNombre', width: 25 }, // Nueva columna para el nombre del área
  //     { header: 'Descripción del Área', key: 'areaDescription', width: 40 },
  //   ];

  //   // 4. Agregar las filas
  //   worksheet.addRows(proyectos);

  //   // 5. Configurar la respuesta para que el navegador descargue el archivo
  //   res.setHeader(
  //     'Content-Type',
  //     'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  //   );
  //   res.setHeader(
  //     'Content-Disposition',
  //     'attachment; filename=' + 'areas_reporte.xlsx',
  //   );

  //   // 6. Escribir el archivo en el stream de respuesta
  //   await workbook.xlsx.write(res);
  //   res.end();
  // }

  async exportToExcel(res: Response) {
    // 1. Obtener los proyectos de SQL Server incluyendo la relación 'area'
    // Es vital usar 'relations' para que el objeto 'area' no venga vacío
    const proyectos = await this.proyectosRepository.find({
      relations: ['area'],
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte de Proyectos');

    // 2. Definir las columnas exactamente como las quieres
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Nombre del Proyecto', key: 'nombreProyecto', width: 35 },
      { header: 'Fecha de Inicio', key: 'fechaInicio', width: 20 },
      { header: 'Fecha de Fin', key: 'fechaFin', width: 20 },
      { header: 'Área Asignada', key: 'areaNombre', width: 25 },
      { header: 'Descripción del Área', key: 'areaDescription', width: 40 },
    ];

    // 3. Aplanar los datos (Flattening)
    // Aquí transformamos el objeto anidado en propiedades planas
    const rows = proyectos.map(proyecto => ({
      id: proyecto.id,
      nombreProyecto: proyecto.nombreProyecto,
      fechaInicio: proyecto.fechaInicio,
      fechaFin: proyecto.fechaFin,
      // Usamos el operador ?. para evitar errores si 'area' es null
      areaNombre: proyecto.area?.nombre || 'Sin Área',
      areaDescription: proyecto.area?.description || 'N/A',
    }));

    // 4. Agregar las filas al archivo
    worksheet.addRows(rows);

    // 5. Estilo profesional: Poner los encabezados en negrita
    worksheet.getRow(1).font = { bold: true };

    // 6. Configuración de cabeceras para la descarga
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=Reporte_Proyectos_${Date.now()}.xlsx`,
    );

    // 7. Escribir y finalizar
    await workbook.xlsx.write(res);
    res.end();
  }

  // =============================================================================================================================

  private handleDBExceptions(error: any) {
    // CAMBIO PARA SQL SERVER: 2627 y 2601 son para llaves duplicadas (Unique)
    if (error.number === 2627 || error.number === 2601) {
      throw new BadRequestException(`El proyecto ya existe: ${error.message}`);
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Error inesperado, revisar logs del servidor');
  }
}