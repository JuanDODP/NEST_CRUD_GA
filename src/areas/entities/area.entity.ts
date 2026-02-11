// import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
// import { Proyecto } from '../../proyectos/entities/proyecto.entity';

// @Entity('areas') 
// export class Area {
//     @PrimaryGeneratedColumn('increment')
//     id: number;

//     @Column()
//     nombre: string;

//     @Column()
//     description: string;

//     // Relación inversa: Un área tiene muchos proyectos
//     @OneToMany(() => Proyecto, (proyecto) => proyecto.area)
//     proyectos: Proyecto[];
// }

import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Proyecto } from '../../proyectos/entities/proyecto.entity';

@Entity('areas') 
export class Area {
    @PrimaryGeneratedColumn('increment')
    id: number;

    // Usamos nvarchar con una longitud definida para optimizar índices
    @Column('nvarchar', { length: 255 })
    nombre: string;

    // Usamos nvarchar(max) en lugar de text para descripciones largas
    @Column('nvarchar', { length: 'max' })
    description: string;

    // La relación se mantiene igual, TypeORM gestiona la FK en SQL Server
    @OneToMany(() => Proyecto, (proyecto) => proyecto.area)
    proyectos: Proyecto[];
}