import { Module } from '@nestjs/common';
import { ProyectosService } from './proyectos.service';
import { ProyectosController } from './proyectos.controller';
import { Proyecto } from './entities/proyecto.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AreasModule } from '../areas/areas.module';

@Module({
  controllers: [ProyectosController],
  providers: [ProyectosService],
  imports: [TypeOrmModule.forFeature([Proyecto]), AreasModule],
  exports: [ProyectosService, TypeOrmModule],
})
export class ProyectosModule {}
