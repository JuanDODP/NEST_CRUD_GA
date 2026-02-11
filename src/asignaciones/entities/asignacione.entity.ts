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

@Entity('asignaciones')
export class Asignacion {
  @PrimaryGeneratedColumn('increment')
  id: number;

  // En SQL Server usamos 'datetime2' para mayor precisión y compatibilidad
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