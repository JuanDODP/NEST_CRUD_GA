import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateAsignacioneDto } from './dto/create-asignacione.dto';
import { UpdateAsignacioneDto } from './dto/update-asignacione.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Asignacion } from './entities/asignacione.entity';
import { DataSource, Repository } from 'typeorm';
import { ProyectosService } from 'src/proyectos/proyectos.service';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class AsignacionesService {
  private readonly logger = new Logger('ProyectosService');

  constructor(
    @InjectRepository(Asignacion)
    private AsignacionesRepository: Repository<Asignacion>,
    private proyectosService: ProyectosService,
    private authService: AuthService,

    private readonly dataSource: DataSource
  ) {

  }
  async create(createAsignacioneDto: CreateAsignacioneDto) {
    const { idProyecto, idUser, ...asignaciones } = createAsignacioneDto
    const { proyecto } = await this.proyectosService.findOne(idProyecto)
    const { usuarios } = await this.authService.findOne(idUser)
    if (!proyecto) {
      throw new NotFoundException(`proyect with id ${idProyecto} not found`)
    }
    else
      if (!usuarios) {
        throw new NotFoundException(`user with id ${idUser} not found`)

      }


    try {
      const asignacion = await this.AsignacionesRepository.create({
        ...asignaciones,
        proyecto: proyecto,
        usuario: usuarios

      })
      await this.AsignacionesRepository.save(asignacion)
      return {
        ok: true,
        asignacion
      }
    } catch (error) {
      this.handleDBExceptions(error)
    }
  }

  async findAll() {
    try {
      const asignaciones = await this.AsignacionesRepository.find({ relations: [ 'usuario', 'proyecto', 'proyecto.area',] })
      return {
        ok: true,
        asignaciones
      }
    } catch (error) {

    }
  }

  async findOne(id: number) {

    const asignasiones = await this.AsignacionesRepository.findOne({
      where: { id },
      relations: [ 'usuario', 'proyecto', 'proyecto.area',]
    })
    if(!asignasiones){
      throw new NotFoundException(`asignacion with id ${id} not founf`)
    }
    
    return {
      ok: true,
      asignasiones
    }
  }

async update(id: number, updateAsignacioneDto: UpdateAsignacioneDto) {
  // 1. Buscamos la asignación actual (usando tu findOne que ya lanza 404)
  const result = await this.findOne(id);
  const asignacionExistente = result?.asignasiones; 

  // 2. Desestructuramos para separar los IDs de los datos directos (como la fecha)
  const { idProyecto, idUser, ...datosActualizar } = updateAsignacioneDto;

  // 3. Validación y asignación de Proyecto (si viene en el DTO)
  if (idProyecto) {
    const res = await this.proyectosService.findOne(idProyecto);
    if (!res.proyecto) {
      throw new NotFoundException(`Proyecto con id ${idProyecto} no encontrado`);
    }
    // Lo anexamos dinámicamente al objeto de actualización
    datosActualizar['proyecto'] = res.proyecto;
  }

  // 4. Validación y asignación de Usuario (si viene en el DTO)
  if (idUser) {
    const res = await this.authService.findOne(idUser);
    const usuario = res.usuarios; // Asegúrate de que tu AuthService use este nombre 'usuarios'
    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${idUser} no encontrado`);
    }
    // Lo anexamos dinámicamente al objeto de actualización
    datosActualizar['usuario'] = usuario;
  }

  try {
    // 5. El merge combina: (Entidad Base, Nuevos Datos con Entidades anexadas)
    const asignacionActualizada = this.AsignacionesRepository.merge(
      asignacionExistente!, 
      datosActualizar
    );

    await this.AsignacionesRepository.save(asignacionActualizada);

    return {
      ok: true,
      asignacion: asignacionActualizada
    };
  } catch (error) {
    this.handleDBExceptions(error);
  }
}

 async remove(id: number) {
  // 1. Buscamos la asignación (usando tu findOne que ya lanza el 404)
  const result = await this.findOne(id);
  const asignacion = result?.asignasiones; // Extraemos la entidad

  if (!asignacion) {
    throw new NotFoundException(`Asignacion with id ${id} not found`);
  }

  try {
    // 2. IMPORTANTE: Usamos el repositorio de ASIGNACIONES para borrar
    // No el servicio de proyectos, ya que no queremos borrar el proyecto, solo la asignación.
    await this.AsignacionesRepository.remove(asignacion);

    return {
      ok: true,
      message: `Asignacion with id ${id} has been removed`
    };
  } catch (error) {
    this.handleDBExceptions(error);
  }
}
  private handleDBExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(`Asignacion exists ${error.detail}`);
    }
    this.logger.error(error);
    throw new InternalServerErrorException('Could not create project');
  }
}
