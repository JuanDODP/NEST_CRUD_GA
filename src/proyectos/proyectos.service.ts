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
    const { idArea, ...proyectosData } = createProyectoDto;
    
    // Buscamos el área
    const { area } = await this.areasService.findOne(idArea);
    
    if (!area) {
      throw new NotFoundException(`Area with id ${idArea} not found`);
    }

    try {
      const proyect = this.proyectosRepository.create({ 
        ...proyectosData, 
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

  async update(id: number, updateProyectoDto: UpdateProyectoDto) {
    const data = await this.findOne(id);
    const proyectoExistente = data.proyecto;

    const { idArea, ...datosActualizar } = updateProyectoDto;

    if (idArea) {
      const { area } = await this.areasService.findOne(idArea);
      if (!area) {
        throw new NotFoundException(`Area with id ${idArea} not found`);
      }
      datosActualizar['area'] = area;
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

  private handleDBExceptions(error: any) {
    // CAMBIO PARA SQL SERVER: 2627 y 2601 son para llaves duplicadas (Unique)
    if (error.number === 2627 || error.number === 2601) {
      throw new BadRequestException(`El proyecto ya existe: ${error.message}`);
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Error inesperado, revisar logs del servidor');
  }
}