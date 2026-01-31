import { Module } from '@nestjs/common';
import { AsignacionesService } from './asignaciones.service';
import { AsignacionesController } from './asignaciones.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asignacion } from './entities/asignacione.entity';
import { ProyectosModule } from '../proyectos/proyectos.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [AsignacionesController],
  providers: [AsignacionesService],
  imports:[TypeOrmModule.forFeature([Asignacion]), ProyectosModule, AuthModule],
  exports:[AsignacionesService, TypeOrmModule]
})
export class AsignacionesModule {}
