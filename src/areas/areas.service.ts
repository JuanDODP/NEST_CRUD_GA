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
    const areas = await this.areasRepository.find();
    return {
      ok: true,
      areas
    };
  }

  async findOne(id: number) {
    let area: Area | null;
    if(id){
       area = await this.areasRepository.findOneBy({ id });
     
    }
    else{
      const queryBuilder = this.areasRepository.createQueryBuilder('area');
      area=  await queryBuilder
       .where('UPPER(title) =:title or slug =:slug', { title: id.toString().toUpperCase(), slug: id.toString() })
       .getOne();
    }
    if (!area) {
      throw new BadRequestException(`Area with id ${id} not found`);
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
      throw new BadRequestException(`Area with id ${id} not found`);
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
     this.handleDBExceptions(error);
   }
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(`Area exists ${error.detail}`);
    }
    this.logger.error(error);
    throw new InternalServerErrorException('Could not create area - Check server logs');
  }
}
