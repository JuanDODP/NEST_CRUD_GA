import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Area } from './entities/area.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AreasService {
  private readonly logger = new Logger('AreasService');
  
  constructor(
    @InjectRepository(Area)
    private readonly areasRepository: Repository<Area>,
  ) { }

  async create(createAreaDto: CreateAreaDto) {
    try {
      const area = this.areasRepository.create(createAreaDto);
      await this.areasRepository.save(area);
      return {
        ok: true,
        area
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

  async update(id: number, updateAreaDto: UpdateAreaDto) {
    const area = await this.areasRepository.preload({
      id: id,
      ...updateAreaDto
    });

    if (!area) {
      throw new NotFoundException(`Area with id ${id} not found`);
    }

    try {
      await this.areasRepository.save(area);
      return {
        ok: true,
        area
      };
    } catch (error) {
      this.handleDBExceptions(error);
    } 
  }

  async remove(id: number) {
    const area = await this.areasRepository.findOne({where: {id}});
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

  private handleDBExceptions(error: any) {
    // --- CAMBIO PARA SQL SERVER ---
    // Los códigos 2627 y 2601 son para violaciones de restricción UNIQUE
    if (error.number === 2627 || error.number === 2601) {
      throw new BadRequestException(`El área ya existe: ${error.message}`);
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Could not process request - Check server logs');
  }
}