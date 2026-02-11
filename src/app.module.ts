// import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { ConfigModule } from '@nestjs/config';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { AuthModule } from './auth/auth.module';
// import { AreasModule } from './areas/areas.module';
// import { ProyectosModule } from './proyectos/proyectos.module';
// import { AsignacionesModule } from './asignaciones/asignaciones.module';

// @Module({
//   imports: [
//     ConfigModule.forRoot(),
//     // para postgress
//     // TypeOrmModule.forRoot({
//     //   type: 'postgres',
//     //   host: process.env.DB_HOST,
//     //   port: Number(process.env.DB_PORT),
//     //   database: process.env.DB_NAME,
//     //   username: process.env.DB_USERNAME,
//     //   password: process.env.DB_PASSWORD,
//     //   autoLoadEntities: true,
//     //   synchronize: true,
//     //   logging: true,
//     // }),
//     // ========================================================================================================================================
//     // Para sql server
//     TypeOrmModule.forRoot({
//   type: 'mssql',
//   host: process.env.DB_HOST,
//   port: Number(process.env.DB_PORT),
//   username: process.env.DB_USERNAME,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   entities: [__dirname + '/**/*.entity{.ts,.js}'],
//   synchronize: true, // ¡Cuidado! Creará las tablas automáticamente
//   extra: {
//     options: {
//       encrypt: false, // Cambia a true si estás en Azure/Producción
//       trustServerCertificate: true, // Vital para Windows local
//     },
//   },
// }),
//     // ========================================================================================================================================

//     AuthModule,
//     AreasModule,
//     ProyectosModule,
//     AsignacionesModule,

//   ],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}
// sql server
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { AreasModule } from './areas/areas.module';
import { ProyectosModule } from './proyectos/proyectos.module';
import { AsignacionesModule } from './asignaciones/asignaciones.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot(),

 TypeOrmModule.forRoot({
  type: 'mssql',
  host: '127.0.0.1',
  port: 1433,
  username: 'sa',
  password: 'Juan123juan!', // Tu contraseña exacta del .env
  database: 'CRUDGA_DB',
  autoLoadEntities: true,
  synchronize: true,
  extra: {
    options: {
      encrypt: false,
      trustServerCertificate: true,
    },
  },
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