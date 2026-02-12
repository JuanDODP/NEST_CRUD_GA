// import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn, OneToMany } from "typeorm";
// import { Area } from '../../areas/entities/area.entity';
// import { Asignacion } from "src/asignaciones/entities/asignacione.entity";

// @Entity('proyectos')
// export class Proyecto {
//     @PrimaryGeneratedColumn('increment')
//     id: number;

//     @Column()
//     nombreProyecto: string;

//     @Column({ type: 'date' })
//     fechaInicio: string;

//     @Column({ type: 'date' })
//     fechaFin: string;

//     // Muchos proyectos pertenecen a una sola Área
//     @ManyToOne(() => Area, (area) => area.proyectos)
//     @JoinColumn({ name: 'areaId' }) // Esto creará la columna areaId en la DB
//     area: Area;
//     // Un proyecto tiene muchas asignaciones
//   @OneToMany(() => Asignacion, (asignacion) => asignacion.proyecto)
//   asignaciones: Asignacion[];
// }
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn, OneToMany, AfterLoad } from "typeorm";
import { Area } from '../../areas/entities/area.entity';
import { Asignacion } from "src/asignaciones/entities/asignacione.entity";

@Entity('proyectos')
export class Proyecto {
    @PrimaryGeneratedColumn('increment')
    id: number;

    // Usamos nvarchar(255) para el nombre del proyecto
    @Column('nvarchar', { length: 255 })
    nombreProyecto: string;

    // En SQL Server, 'date' funciona, pero 'datetime2' es más preciso 
    // y evita errores de conversión de strings ISO a fecha.
    @Column({ type: 'datetime2' })
    fechaInicio: string;

    @Column({ type: 'datetime2' })
    fechaFin: string;

    // Relación ManyToOne: Se mantiene la lógica, TypeORM creará un 
    // campo areaId de tipo INT para SQL Server.
    @Column('nvarchar', { length: 255, default: 'default-image.png' })
    imagen: string;
    @ManyToOne(() => Area, (area) => area.proyectos)
    @JoinColumn({ name: 'areaId' })
    area: Area;

    @OneToMany(() => Asignacion, (asignacion) => asignacion.proyecto)
    asignaciones: Asignacion[];

    @AfterLoad()
    updateImageUrl() {
        // Solo si la imagen no es ya una URL completa (para evitar duplicar el host)
        if (this.imagen && !this.imagen.startsWith('http')) {
            // Nota: Aquí podrías usar una variable de entorno, 
            // pero para pruebas rápidas lo dejamos así o usamos el servicio.
            this.imagen = `http://localhost:3000/api/files/proyectos/${this.imagen}`;
        }
    }
}