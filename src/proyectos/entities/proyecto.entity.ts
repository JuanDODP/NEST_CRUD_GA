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
// }import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn, OneToMany, AfterLoad } from "typeorm";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn, OneToMany, AfterLoad } from "typeorm";
import { Area } from '../../areas/entities/area.entity';
import { Asignacion } from "src/asignaciones/entities/asignacione.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity('proyectos')
export class Proyecto {
    @ApiProperty({ example: 1, description: 'Identificador único del proyecto', uniqueItems: true })
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ApiProperty({ example: 'kzjkzx', description: 'Nombre del proyecto' })
    @Column('nvarchar', { length: 255 })
    nombreProyecto: string;

    @ApiProperty({ 
        example: '2026-02-20T06:00:00.000Z', 
        description: 'Fecha de inicio del proyecto en formato ISO8601' 
    })
    @Column({ type: 'datetime2' })
    fechaInicio: string;

    @ApiProperty({ 
        example: '2026-03-07T06:00:00.000Z', 
        description: 'Fecha estimada de finalización' 
    })
    @Column({ type: 'datetime2' })
    fechaFin: string;

    @ApiProperty({ 
        example: '906bbda0-40e4-405d-8ef7-5d8b35490a47.png', 
        description: 'Nombre del archivo de imagen o UUID guardado en el servidor' 
    })
    @Column('nvarchar', { length: 255, default: 'default-image.png' })
    imagen: string;

    @ApiProperty({ type: () => Area, description: 'Información del área a la que pertenece el proyecto' })
    @ManyToOne(() => Area, (area) => area.proyectos)
    @JoinColumn({ name: 'areaId' })
    area: Area;

    @ApiProperty({ type: () => [Asignacion], description: 'Lista de asignaciones asociadas a este proyecto' })
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