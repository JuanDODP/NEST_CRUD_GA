import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Proyecto } from '../../proyectos/entities/proyecto.entity';

@Entity('asignaciones')
export class Asignacion {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  fechaAsignacion: string;

  // Relación con Usuario
  @ManyToOne(() => User, (user) => user.asignaciones)
  @JoinColumn({ name: 'idUsuario' })
  usuario: User;

  // Relación con Proyecto
  @ManyToOne(() => Proyecto, (proyecto) => proyecto.asignaciones)
  @JoinColumn({ name: 'idProyecto' })
  proyecto: Proyecto;
}