// import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
// import { User } from '../../auth/entities/user.entity';
// import { Proyecto } from '../../proyectos/entities/proyecto.entity';

// @Entity('asignaciones')
// export class Asignacion {
//   @PrimaryGeneratedColumn('increment')
//   id: number;

//   @Column()
//   fechaAsignacion: string;

//   // Relación con Usuario
//   @ManyToOne(() => User, (user) => user.asignaciones)
//   @JoinColumn({ name: 'idUsuario' })
//   usuario: User;

//   // Relación con Proyecto
//   @ManyToOne(() => Proyecto, (proyecto) => proyecto.asignaciones)
//   @JoinColumn({ name: 'idProyecto' })
//   proyecto: Proyecto;
// }

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Proyecto } from '../../proyectos/entities/proyecto.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('asignaciones')
export class Asignacion {
  @ApiProperty({ example: 1, description: 'Identificador único de la asignación', uniqueItems: true })
  
  @PrimaryGeneratedColumn('increment')
  id: number;

  // En SQL Server usamos 'datetime2' para mayor precisión y compatibilidad
  @ApiProperty({ 
    example: '2026-02-20T06:00:00.000Z', 
    description: 'Fecha de asignación en formato ISO8601' 
  })
  @Column({ type: 'datetime2' })
  fechaAsignacion: string;

  // Relación con Usuario
  // SQL Server creará automáticamente la columna 'idUsuario' como INT
  @ManyToOne(() => User, (user) => user.asignaciones)
  @JoinColumn({ name: 'idUsuario' })
  usuario: User;

  // Relación con Proyecto
  // SQL Server creará automáticamente la columna 'idProyecto' como INT
  @ManyToOne(() => Proyecto, (proyecto) => proyecto.asignaciones)
  @JoinColumn({ name: 'idProyecto' })
  proyecto: Proyecto;
}