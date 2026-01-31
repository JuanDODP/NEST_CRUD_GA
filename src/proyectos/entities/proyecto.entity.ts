import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn, OneToMany } from "typeorm";
import { Area } from '../../areas/entities/area.entity';
import { Asignacion } from "src/asignaciones/entities/asignacione.entity";

@Entity('proyectos')
export class Proyecto {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    nombreProyecto: string;

    @Column({ type: 'date' })
    fechaInicio: string;

    @Column({ type: 'date' })
    fechaFin: string;

    // Muchos proyectos pertenecen a una sola Área
    @ManyToOne(() => Area, (area) => area.proyectos)
    @JoinColumn({ name: 'areaId' }) // Esto creará la columna areaId en la DB
    area: Area;
    // Un proyecto tiene muchas asignaciones
  @OneToMany(() => Asignacion, (asignacion) => asignacion.proyecto)
  asignaciones: Asignacion[];
}