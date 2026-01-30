import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { AreasModule } from './areas/areas.module';
import { ProyectosModule } from './proyectos/proyectos.module';
import { AsignacionesModule } from './asignaciones/asignaciones.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
    }),
    AuthModule,
    AreasModule,
    ProyectosModule,
    AsignacionesModule,
  
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
