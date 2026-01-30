import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from "typeorm";
import { Area } from '../../areas/entities/area.entity';

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
}