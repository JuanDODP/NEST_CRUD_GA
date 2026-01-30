import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Proyecto } from './entities/proyecto.entity';
import { DataSource, Repository } from 'typeorm';
import { AreasService } from '../areas/areas.service';

@Injectable()
export class ProyectosService {
  private readonly logger = new Logger('ProyectosService');
  constructor(
    @InjectRepository(Proyecto)
    private proyectosRepository: Repository<Proyecto>,
    private areasService: AreasService,
    private readonly dataSource: DataSource
  ) { }
  async create(createProyectoDto: CreateProyectoDto) {
    const { idArea, ...proyectos } = createProyectoDto;
    const area = await this.areasService.findOne(idArea);
    if (!area) {
      throw new NotFoundException(`Area with id ${idArea} not found`);
    }
    try {
      const proyect = await this.proyectosRepository.create({ ...proyectos, area: area.area });
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
      const proyectos = await this.proyectosRepository.find({ relations: ['area'] });
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



  async update(id: number, updateProyectoDto: UpdateProyectoDto) {
    // 1. Buscamos primero el proyecto para estar seguros de que existe
    // Tu findOne ya maneja el error 404 si no existe
    const data = await this.findOne(id);
    const proyectoExistente = data.proyecto;

    const { idArea, ...datosActualizar } = updateProyectoDto;
    if (idArea) {
      const area = await this.areasService.findOne(idArea);
      if (!area) {
        throw new NotFoundException(`Area with id ${idArea} not found`);
      }
      datosActualizar['area'] = area.area;
    }

    try {
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
    const proyecto = await this.findOne(id);
    if (!proyecto) {
      throw new NotFoundException(`Proyecto with id ${id} not found`);
    }
     try {
       await this.proyectosRepository.remove(proyecto.proyecto);
       return {
         message: `Proyecto with id ${id} removed successfully`
       };
     } catch (error) {
       this.handleDBExceptions(error);
     }
  }
  private handleDBExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(`Project exists ${error.detail}`);
    }
    this.logger.error(error);
    throw new InternalServerErrorException('Could not create project');
  }
}

