import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateAsignacioneDto } from './dto/create-asignacione.dto';
import { UpdateAsignacioneDto } from './dto/update-asignacione.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Asignacion } from './entities/asignacione.entity';
import { DataSource, Repository } from 'typeorm';
import { ProyectosService } from 'src/proyectos/proyectos.service';
import { AuthService } from '../auth/auth.service';
import * as fs from 'fs';
import * as path from 'path';
const PDFDocument = require('pdfkit');

@Injectable()
export class AsignacionesService {
  private readonly logger = new Logger('AsignacionesService');

  constructor(
    @InjectRepository(Asignacion)
    private asignacionesRepository: Repository<Asignacion>,
    private proyectosService: ProyectosService,
    private authService: AuthService,
    private readonly dataSource: DataSource,
  ) {}

  // =========================
  // CREATE
  // =========================
  async create(createAsignacioneDto: CreateAsignacioneDto) {
    const { idProyecto, idUser, ...asignacionesData } =
      createAsignacioneDto;

    const { proyecto } =
      await this.proyectosService.findOne(idProyecto);
    const { usuarios: usuario } =
      await this.authService.findOne(idUser);

    if (!proyecto)
      throw new NotFoundException(
        `Project with id ${idProyecto} not found`,
      );

    if (!usuario)
      throw new NotFoundException(
        `User with id ${idUser} not found`,
      );

    try {
      const asignacion = this.asignacionesRepository.create({
        ...asignacionesData,
        proyecto,
        usuario,
      });

      await this.asignacionesRepository.save(asignacion);

      return {
        ok: true,
        asignacion,
      };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  // =========================
  // FIND ALL
  // =========================
  async findAll() {
    try {
      const asignaciones =
        await this.asignacionesRepository.find({
          relations: ['usuario', 'proyecto', 'proyecto.area'],
          where: {
            usuario: {
              isActive: true,
            },
          },
        });

      const cleanAsignaciones = asignaciones.map((a) => {
        if (a.usuario) {
          const { password, ...userWithoutPassword } = a.usuario;
          a.usuario = userWithoutPassword as any;
        }
        return a;
      });

      return {
        ok: true,
        asignaciones: cleanAsignaciones,
      };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  // =========================
  // FIND ONE
  // =========================
  async findOne(id: number) {
    const asignacion =
      await this.asignacionesRepository.findOne({
        where: { id, usuario: { isActive: true } },
        relations: ['usuario', 'proyecto', 'proyecto.area'],
      });

    if (!asignacion)
      throw new NotFoundException(
        `Asignacion with id ${id} not found`,
      );

    if (asignacion.usuario) {
      const { password, ...userWithoutPassword } =
        asignacion.usuario;
      asignacion.usuario = userWithoutPassword as any;
    }

    return {
      ok: true,
      asignacion,
    };
  }

  // =========================
  // UPDATE
  // =========================
  async update(
    id: number,
    updateAsignacioneDto: UpdateAsignacioneDto,
  ) {
    const { asignacion } = await this.findOne(id);

    const { idProyecto, idUser, ...datosActualizar } =
      updateAsignacioneDto;

    if (idProyecto) {
      const { proyecto } =
        await this.proyectosService.findOne(idProyecto);
      if (!proyecto)
        throw new NotFoundException(
          `Proyecto con id ${idProyecto} no encontrado`,
        );
      datosActualizar['proyecto'] = proyecto;
    }

    if (idUser) {
      const { usuarios } =
        await this.authService.findOne(idUser);
      if (!usuarios)
        throw new NotFoundException(
          `Usuario con id ${idUser} no encontrado`,
        );
      datosActualizar['usuario'] = usuarios;
    }

    try {
      const asignacionActualizada =
        this.asignacionesRepository.merge(
          asignacion,
          datosActualizar,
        );

      await this.asignacionesRepository.save(
        asignacionActualizada,
      );

      return {
        ok: true,
        asignacion: asignacionActualizada,
      };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  // =========================
  // REMOVE
  // =========================
  async remove(id: number) {
    const { asignacion } = await this.findOne(id);

    try {
      await this.asignacionesRepository.remove(asignacion);

      return {
        ok: true,
        message: `Asignacion with id ${id} has been removed`,
      };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  // =========================
  // GENERAR PDF
  // =========================
  async generatePdf(id: number): Promise<Buffer> {
  const asignacion = await this.asignacionesRepository.findOne({
    where: { id, usuario: { isActive: true } },
    relations: ['usuario', 'proyecto', 'proyecto.area'],
  });

  if (!asignacion) {
    throw new NotFoundException(
      `Asignacion with id ${id} not found`,
    );
  }

  const doc = new PDFDocument({
    margin: 50,
    size: 'A4',
  });

  const chunks: Buffer[] = [];
  doc.on('data', (chunk: Buffer) => chunks.push(chunk));

  const formatDate = (date: string | Date | null) => {
    if (!date) return 'No disponible';
    return new Date(date).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Obtener rutas de imágenes
  const userImage = this.getImageFromUrl(asignacion.usuario?.imagen);
  const projectImage = this.getImageFromUrl(asignacion.proyecto?.imagen);
  const areaImage = this.getImageFromUrl(asignacion.proyecto?.area?.imagen);

  // =========================
  // HEADER
  // =========================
  doc
    .fontSize(22)
    .fillColor('#1F2937')
    .text('REPORTE DE ASIGNACIÓN', { align: 'center' });

  doc.moveDown(2);

  // =========================
  // ASIGNACIÓN
  // =========================
  doc.fontSize(16).fillColor('#2563EB').text('Datos de la Asignación');
  doc.moveDown(0.5);
  doc.fontSize(12).fillColor('#111827');

  doc.text(`ID: ${asignacion.id}`);
  doc.text(`Fecha de Asignación: ${formatDate(asignacion.fechaAsignacion)}`);

  doc.moveDown(1.5);

  // =========================
  // USUARIO
  // =========================
  doc.fontSize(16).fillColor('#2563EB').text('Datos del Usuario');
  doc.moveDown(0.5);
  doc.fontSize(12).fillColor('#111827');

  doc.text(`Nombre: ${asignacion.usuario?.name ?? 'No disponible'}`);
  doc.text(`Correo: ${asignacion.usuario?.email ?? 'No disponible'}`);
  doc.text(`Rol: ${asignacion.usuario?.rol ?? 'No disponible'}`);
  doc.text(`Activo: ${asignacion.usuario?.isActive ? 'Sí' : 'No'}`);

  if (userImage) {
    try {
      doc.moveDown();
     doc.image(userImage, 400, doc.y - 80, { width: 120 });

    } catch (error) {
      console.log('Error cargando imagen usuario:', error.message);
    }
  }

  doc.moveDown(1.5);

  // =========================
  // PROYECTO
  // =========================
  doc.fontSize(16).fillColor('#2563EB').text('Datos del Proyecto');
  doc.moveDown(0.5);
  doc.fontSize(12).fillColor('#111827');

  doc.text(`Nombre: ${asignacion.proyecto?.nombreProyecto ?? 'No disponible'}`);
  doc.text(`Fecha Inicio: ${formatDate(asignacion.proyecto?.fechaInicio)}`);
  doc.text(`Fecha Fin: ${formatDate(asignacion.proyecto?.fechaFin)}`);

  if (projectImage) {
    try {
      doc.moveDown();
      doc.image(projectImage, { fit: [120, 120] });
    } catch (error) {
      console.log('Error cargando imagen proyecto:', error.message);
    }
  }

  doc.moveDown(1.5);

  // =========================
  // AREA
  // =========================
  doc.fontSize(16).fillColor('#2563EB').text('Datos del Área');
  doc.moveDown(0.5);
  doc.fontSize(12).fillColor('#111827');

  doc.text(`Nombre: ${asignacion.proyecto?.area?.nombre ?? 'No disponible'}`);
  doc.text(`Descripción: ${asignacion.proyecto?.area?.description ?? 'No disponible'}`);

  if (areaImage) {
    try {
      doc.moveDown();
      doc.image(areaImage, { fit: [120, 120] });
    } catch (error) {
      console.log('Error cargando imagen área:', error.message);
    }
  }

  doc.moveDown(3);

  doc
    .fontSize(10)
    .fillColor('#6B7280')
    .text(
      `Documento generado el ${new Date().toLocaleString('es-MX')}`,
      { align: 'center' },
    );

  doc.end();

  return new Promise<Buffer>((resolve, reject) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
  });
}


  // =========================
  // MANEJO DE ERRORES DB
  // =========================
  private handleDBExceptions(error: any) {
    if (error?.number === 2627 || error?.number === 2601) {
      throw new BadRequestException(
        `Asignacion already exists: ${error.message}`,
      );
    }

    if (error?.number === 547) {
      throw new BadRequestException(
        `Database relation error: ${error.message}`,
      );
    }

    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }

  // =========================
  // LEER IMAGEN DESDE STATIC
  // =========================
  private getImageFromUrl(url: string | undefined): string | null {
  if (!url) return null;

  try {
    const parts = url.split('/');
    const folder = parts[parts.length - 2];
    const filename = parts[parts.length - 1];

    const filePath = path.resolve(
      process.cwd(),
      'static',
      folder,
      filename,
    );

    if (!fs.existsSync(filePath)) {
      console.log('No existe la imagen:', filePath);
      return null;
    }

    // 🔥 VALIDAR EXTENSIÓN
    const ext = path.extname(filePath).toLowerCase();

    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
      console.log('Formato no soportado por PDFKit:', ext);
      return null;
    }

    return filePath; // 🔥 devolvemos la ruta, no el buffer
  } catch (error) {
    console.log('Error leyendo imagen:', error);
    return null;
  }
}

}
