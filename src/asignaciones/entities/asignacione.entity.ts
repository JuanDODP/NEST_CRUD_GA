// // import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
// // import { User } from '../../auth/entities/user.entity';
// // import { Proyecto } from '../../proyectos/entities/proyecto.entity';

// // @Entity('asignaciones')
// // export class Asignacion {
// //   @PrimaryGeneratedColumn('increment')
// //   id: number;

// //   @Column()
// //   fechaAsignacion: string;

// //   // Relación con Usuario
// //   @ManyToOne(() => User, (user) => user.asignaciones)
// //   @JoinColumn({ name: 'idUsuario' })
// //   usuario: User;

// //   // Relación con Proyecto
// //   @ManyToOne(() => Proyecto, (proyecto) => proyecto.asignaciones)
// //   @JoinColumn({ name: 'idProyecto' })
// //   proyecto: Proyecto;
// // }

// import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
// import { User } from '../../auth/entities/user.entity';
// import { Proyecto } from '../../proyectos/entities/proyecto.entity';

// @Entity('asignaciones')
// export class Asignacion {
//   @PrimaryGeneratedColumn('increment')
//   id: number;

//   // En SQL Server usamos 'datetime2' para mayor precisión y compatibilidad
//   @Column({ type: 'datetime2' })
//   fechaAsignacion: string;

//   // Relación con Usuario
//   // SQL Server creará automáticamente la columna 'idUsuario' como INT
//   @ManyToOne(() => User, (user) => user.asignaciones)
//   @JoinColumn({ name: 'idUsuario' })
//   usuario: User;

//   // Relación con Proyecto
//   // SQL Server creará automáticamente la columna 'idProyecto' como INT
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

  // CAMBIO: 'datetime2' no existe en Postgres. 
  // Usamos 'timestamp' (o 'timestamptz' si necesitas manejar zonas horarias).
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fechaAsignacion: Date; // Recomendado usar Date en lugar de string para mejor manejo

  // Relación con Usuario
  // TypeORM creará automáticamente la columna 'idUsuario' como INTEGER
  @ManyToOne(() => User, (user) => user.asignaciones, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idUsuario' })
  usuario: User;

  // Relación con Proyecto
  // TypeORM creará automáticamente la columna 'idProyecto' como INTEGER
  @ManyToOne(() => Proyecto, (proyecto) => proyecto.asignaciones, { onDelete: 'CASCADE' } )
  @JoinColumn({ name: 'idProyecto' })
  proyecto: Proyecto;
}