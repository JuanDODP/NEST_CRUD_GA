import { Module } from '@nestjs/common';
import { AreasService } from './areas.service';
import { AreasController } from './areas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Area } from './entities/area.entity';

@Module({
  controllers: [AreasController],
  providers: [AreasService],
  imports: [ TypeOrmModule.forFeature([Area])],
  exports: [AreasService, TypeOrmModule],
})
export class AreasModule {}
