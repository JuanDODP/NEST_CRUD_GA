import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Proyecto } from '../../proyectos/entities/proyecto.entity';

@Entity('areas') 
export class Area {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    nombre: string;

    @Column()
    description: string;

    // Relación inversa: Un área tiene muchos proyectos
    @OneToMany(() => Proyecto, (proyecto) => proyecto.area)
    proyectos: Proyecto[];
}