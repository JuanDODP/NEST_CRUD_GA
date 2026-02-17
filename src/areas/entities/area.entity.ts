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

import { AfterLoad, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Proyecto } from '../../proyectos/entities/proyecto.entity';
import { ApiProperty } from "@nestjs/swagger";

@Entity('areas')
export class Area {
    @ApiProperty({ example: 1, description: 'Identificador único del área', uniqueItems: true })
    @PrimaryGeneratedColumn('increment')
    id: number;

    // Usamos nvarchar con una longitud definida para optimizar índices
    @ApiProperty({ example: 'Marketing', description: 'Nombre del área',})
    @Column('nvarchar', { length: 255 })
    nombre: string;

    @ApiProperty({ example: 'default-image.png', description: 'Nombre del archivo de imagen del área' })
    @Column('nvarchar', { length: 255, default: 'default-image.png' })
    imagen: string;
    @ApiProperty({ example: 'Area especializada en publicidad', description: 'Descripción detallada del área' })
    @Column('nvarchar', { length: 'max' })
    description: string;

    // Usamos nvarchar(max) en lugar de text para descripciones largas
   

    // La relación se mantiene igual, TypeORM gestiona la FK en SQL Server
    //  @ApiProperty({ type: () => [Proyecto], description: 'Lista de proyectos asociados a esta área' })
    @OneToMany(() => Proyecto, (proyecto) => proyecto.area)
    proyectos: Proyecto[];


    // Este método se ejecuta automáticamente después de cargar el área de la DB
    @AfterLoad()
    updateImageUrl() {
        // Solo si la imagen no es ya una URL completa (para evitar duplicar el host)
        if (this.imagen && !this.imagen.startsWith('http')) {
            // Nota: Aquí podrías usar una variable de entorno, 
            // pero para pruebas rápidas lo dejamos así o usamos el servicio.
            this.imagen = `http://localhost:3000/api/files/areas/${this.imagen}`;
        }
    }
}