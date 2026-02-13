import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateAsignacioneDto } from './dto/create-asignacione.dto';
import { UpdateAsignacioneDto } from './dto/update-asignacione.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Asignacion } from './entities/asignacione.entity';
import { DataSource, Repository } from 'typeorm';
import { ProyectosService } from 'src/proyectos/proyectos.service';
import { AuthService } from '../auth/auth.service';
const PDFDocument = require('pdfkit');

@Injectable()
export class AsignacionesService {
  private readonly logger = new Logger('AsignacionesService');

  constructor(
    @InjectRepository(Asignacion)
    private asignacionesRepository: Repository<Asignacion>,
    private proyectosService: ProyectosService,
    private authService: AuthService,
    private readonly dataSource: DataSource
  ) { }

  async create(createAsignacioneDto: CreateAsignacioneDto) {
    const { idProyecto, idUser, ...asignacionesData } = createAsignacioneDto;

    // Buscamos las entidades relacionadas
    const { proyecto } = await this.proyectosService.findOne(idProyecto);
    const { usuarios: usuario } = await this.authService.findOne(idUser);

    if (!proyecto) throw new NotFoundException(`Project with id ${idProyecto} not found`);
    if (!usuario) throw new NotFoundException(`User with id ${idUser} not found`);

    try {
      const asignacion = this.asignacionesRepository.create({
        ...asignacionesData,
        proyecto,
        usuario
      });

      await this.asignacionesRepository.save(asignacion);

      return {
        ok: true,
        asignacion
      };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll() {
    try {
      const asignaciones = await this.asignacionesRepository.find({
        relations: ['usuario', 'proyecto', 'proyecto.area'],
        where: {
          usuario: {
            isActive: true
          }
        }
      });

      // Limpiamos datos sensibles (password) de los usuarios relacionados
      const cleanAsignaciones = asignaciones.map(asignacion => {
        if (asignacion.usuario) {
          const { password, ...userWithoutPassword } = asignacion.usuario;
          asignacion.usuario = userWithoutPassword as any;
        }
        return asignacion;
      });

      return {
        ok: true,
        asignaciones: cleanAsignaciones
      };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findOne(id: number) {
    const asignacion = await this.asignacionesRepository.findOne({
      where: { id },
      relations: ['usuario', 'proyecto', 'proyecto.area']
    });

    if (!asignacion) {
      throw new NotFoundException(`Asignacion with id ${id} not found`);
    }

    if (asignacion.usuario) {
      const { password, ...userWithoutPassword } = asignacion.usuario;
      asignacion.usuario = userWithoutPassword as any;
    }

    return {
      ok: true,
      asignasiones: asignacion
    };
  }

  async update(id: number, updateAsignacioneDto: UpdateAsignacioneDto) {
    const result = await this.findOne(id);
    const asignacionExistente = result.asignasiones;

    const { idProyecto, idUser, ...datosActualizar } = updateAsignacioneDto;

    if (idProyecto) {
      const res = await this.proyectosService.findOne(idProyecto);
      if (!res.proyecto) throw new NotFoundException(`Proyecto con id ${idProyecto} no encontrado`);
      datosActualizar['proyecto'] = res.proyecto;
    }

    if (idUser) {
      const res = await this.authService.findOne(idUser);
      if (!res.usuarios) throw new NotFoundException(`Usuario con id ${idUser} no encontrado`);
      datosActualizar['usuario'] = res.usuarios;
    }

    try {
      const asignacionActualizada = this.asignacionesRepository.merge(
        asignacionExistente,
        datosActualizar
      );

      await this.asignacionesRepository.save(asignacionActualizada);

      return {
        ok: true,
        asignacion: asignacionActualizada
      };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: number) {
    const result = await this.findOne(id);
    const asignacion = result.asignasiones;

    try {
      await this.asignacionesRepository.remove(asignacion);
      return {
        ok: true,
        message: `Asignacion with id ${id} has been removed`
      };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  // generar pdf

  async generatePdf(id: number): Promise<Buffer> {
    const asignacion = await this.asignacionesRepository.findOne({
      where: { id },
      relations: ['usuario', 'proyecto', 'proyecto.area'],
    });

    if (!asignacion) {
      throw new NotFoundException(`Asignacion with id ${id} not found`);
    }

    const doc = new PDFDocument();
    const chunks: Buffer[] = [];

    doc.on('data', (chunk: Buffer) => chunks.push(chunk));

    doc.fontSize(20).text('DETALLES DE ASIGNACIÓN', {
      align: 'center',
    });

    doc.moveDown();

    doc.fontSize(12);
    doc.text(`Folio: ${asignacion.id}`);
    doc.text(`Proyecto: ${asignacion.proyecto?.nombreProyecto || 'N/A'}`);
    doc.text(`Usuario: ${asignacion.usuario?.name || 'N/A'}`);
    doc.text(`Fecha: ${asignacion.fechaAsignacion}`);
    doc.text(`Área: ${asignacion.proyecto?.area?.nombre || 'N/A'}`);

    doc.end();

    return await new Promise<Buffer>((resolve, reject) => {
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', (err) => reject(err));
    });
  }

  private handleDBExceptions(error: any) {
    // Cambiamos 'error.code' (Postgres) por 'error.number' (SQL Server)
    // 2627 y 2601: Violación de restricción Unique
    if (error.number === 2627 || error.number === 2601) {
      throw new BadRequestException(`Asignacion already exists: ${error.message}`);
    }

    // 547: Violación de Foreign Key (Conflictos de referencia)
    if (error.number === 547) {
      throw new BadRequestException(`Database relation error: ${error.message}`);
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}