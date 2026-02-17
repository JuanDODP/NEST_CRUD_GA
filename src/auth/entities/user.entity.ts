// import { Asignacion } from "src/asignaciones/entities/asignacione.entity";
// import {
//     BeforeInsert,
//     BeforeUpdate,
//     Column,
//     Entity,
//     PrimaryGeneratedColumn,
//     CreateDateColumn,
//     OneToMany,
// } from "typeorm";

// @Entity('users')
// export class User {

//     @PrimaryGeneratedColumn('increment')
//     id: number; // IdUsuario (PK)

//     @Column('text')
//     name: string; // Nombre

//     @Column('text', { unique: true })
//     email: string; // Correo
//     @Column('text')
//     password: string; // Contrasena
//     // si esta activo o no
//      @Column('boolean', { default: true })
//     isActive: boolean;
//     @Column('text', { array: true, default: ['user'] })
//     rol: string[]; // Rol

//     @CreateDateColumn({ type: 'timestamp' })
//     fechaRegistro: Date; // FechaRegistro

//     // ==========================================
//     // Hooks para mantener la integridad del correo
//     // ==========================================

//     // Un usuario puede estar en muchas asignaciones (muchos proyectos)
//   @OneToMany(() => Asignacion, (asignacion) => asignacion.usuario)
//   asignaciones: Asignacion[];
//     @BeforeInsert()
//     normalizeEmail() {
//         this.email = this.email.toLowerCase().trim();
//     }

//     @BeforeUpdate()
//     checkEmailUpdate() {
//         this.normalizeEmail();
//     }
// }
import { Asignacion } from "src/asignaciones/entities/asignacione.entity";
import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    OneToMany,
    AfterLoad,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

@Entity('users')
export class User {

    @ApiProperty({ example: 2015, description: 'Identificador único del usuario' })
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ApiProperty({ example: 'testetete', description: 'Nombre completo del usuario' })
    @Column('nvarchar', { length: 255 })
    name: string;

    @ApiProperty({ example: 'testzarezzgisterw@example.com', description: 'Correo electrónico único' })
    @Column('nvarchar', { length: 255, unique: true })
    email: string;

    @ApiProperty({ description: 'Contraseña del usuario (oculta en las consultas)', writeOnly: true })
    @Column('nvarchar', { length: 'max', select: false })
    password: string;

    @ApiProperty({ example: true, description: 'Estado de la cuenta del usuario' })
    @Column('bit', { default: true })
    isActive: boolean;

    @ApiProperty({ example: 'user', description: 'Rol asignado al usuario' })
    @Column('nvarchar', { length: 255, default: 'user' })
    rol: string;

    @ApiProperty({ 
        example: 'default-avatar-user.jpg', 
        description: 'Nombre del archivo de imagen de perfil' 
    })
    @Column('nvarchar', { length: 255, default: 'default-avatar-user.jpg' })
    imagen: string;

    @ApiProperty({ 
        example: '2026-02-17T08:56:19.873Z', 
        description: 'Fecha y hora de registro en la plataforma' 
    })
    @CreateDateColumn({ type: 'datetime2' })
    fechaRegistro: Date;

    @ApiProperty({ type: () => [Asignacion], description: 'Lista de asignaciones del usuario' })
    @OneToMany(() => Asignacion, (asignacion) => asignacion.usuario)
    asignaciones: Asignacion[];

    @BeforeInsert()
    normalizeEmail() {
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkEmailUpdate() {
        this.normalizeEmail();
    }

    @AfterLoad()
    updateImageUrl() {
        if (this.imagen && !this.imagen.startsWith('http')) {
            this.imagen = `http://localhost:3000/api/files/users/${this.imagen}`;
        }
    }
}