// // import { Asignacion } from "src/asignaciones/entities/asignacione.entity";
// // import {
// //     BeforeInsert,
// //     BeforeUpdate,
// //     Column,
// //     Entity,
// //     PrimaryGeneratedColumn,
// //     CreateDateColumn,
// //     OneToMany,
// // } from "typeorm";

// // @Entity('users')
// // export class User {

// //     @PrimaryGeneratedColumn('increment')
// //     id: number; // IdUsuario (PK)

// //     @Column('text')
// //     name: string; // Nombre

// //     @Column('text', { unique: true })
// //     email: string; // Correo
// //     @Column('text')
// //     password: string; // Contrasena
// //     // si esta activo o no
// //      @Column('boolean', { default: true })
// //     isActive: boolean;
// //     @Column('text', { array: true, default: ['user'] })
// //     rol: string[]; // Rol

// //     @CreateDateColumn({ type: 'timestamp' })
// //     fechaRegistro: Date; // FechaRegistro

// //     // ==========================================
// //     // Hooks para mantener la integridad del correo
// //     // ==========================================

// //     // Un usuario puede estar en muchas asignaciones (muchos proyectos)
// //   @OneToMany(() => Asignacion, (asignacion) => asignacion.usuario)
// //   asignaciones: Asignacion[];
// //     @BeforeInsert()
// //     normalizeEmail() {
// //         this.email = this.email.toLowerCase().trim();
// //     }

// //     @BeforeUpdate()
// //     checkEmailUpdate() {
// //         this.normalizeEmail();
// //     }
// // }
// import { Asignacion } from "src/asignaciones/entities/asignacione.entity";
// import {
//     BeforeInsert,
//     BeforeUpdate,
//     Column,
//     Entity,
//     PrimaryGeneratedColumn,
//     CreateDateColumn,
//     OneToMany,
//     AfterLoad,
// } from "typeorm";

// @Entity('users')
// export class User {

//     @PrimaryGeneratedColumn('increment')
//     id: number;

//     // En SQL Server usamos nvarchar para soporte Unicode (acentos, ñ)
//     @Column('nvarchar', { length: 255 })
//     name: string;

//     @Column('nvarchar', { length: 255, unique: true })
//     email: string;

//     // Usamos nvarchar(max) en lugar de text, que está deprecado
//     @Column('nvarchar', { length: 'max', select: false })
//     password: string;

//     // SQL Server usa el tipo 'bit' para booleanos (0 o 1)
//     @Column('bit', { default: true })
//     isActive: boolean;

//     // IMPORTANTE: SQL Server NO soporta arreglos. 
//     // Lo manejaremos como un string simple (ej: "user" o "admin,user")
//     @Column('nvarchar', { length: 255, default: 'user' })
//     rol: string;
//     @Column('nvarchar', { length: 255, default: 'default-avatar-user.jpg' })
//     imagen: string;
//     @Column('decimal', { precision: 18, scale: 2, default: 0.00 })
//     salary: number;

//     // 'timestamp' en SQL Server no es para fechas, se usa 'datetime2'
//     @CreateDateColumn({ type: 'datetime2' })
//     fechaRegistro: Date;

//     @OneToMany(() => Asignacion, (asignacion) => asignacion.usuario)
//     asignaciones: Asignacion[];

//     @BeforeInsert()
//     normalizeEmail() {
//         this.email = this.email.toLowerCase().trim();
//     }

//     @BeforeUpdate()
//     checkEmailUpdate() {
//         this.normalizeEmail();
//     }
//     @AfterLoad()
//     updateImageUrl() {
//         // Solo si la imagen no es ya una URL completa (para evitar duplicar el host)
//         if (this.imagen && !this.imagen.startsWith('http')) {
//             // Nota: Aquí podrías usar una variable de entorno, 
//             // pero para pruebas rápidas lo dejamos así o usamos el servicio.
//             this.imagen = `http://localhost:3000/api/files/users/${this.imagen}`;
//         }
//     }
// }
import { Asignacion } from "../../asignaciones/entities/asignacione.entity"; // Ajusta la ruta si es necesario
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

@Entity('users')
export class User {

    @PrimaryGeneratedColumn('increment')
    id: number;

    // CAMBIO: 'nvarchar' -> 'varchar'. Postgres maneja Unicode nativamente en varchar.
    @Column('varchar', { length: 255 })
    name: string;

    @Column('varchar', { length: 255, unique: true })
    email: string;

    // CAMBIO: 'nvarchar(max)' -> 'text'. En Postgres 'text' es el estándar para strings largos.
    @Column('text', { select: false })
    password: string;

    // CAMBIO: 'bit' -> 'boolean'. Postgres tiene el tipo boolean real (true/false).
    @Column('boolean', { default: true })
    isActive: boolean;

    // MEJORA: Postgres SOPORTA ARREGLOS nativamente. Volvemos al diseño original.
    @Column('text', { array: true, default: ['user'] })
    rol: string[];

    @Column('varchar', { length: 255, default: 'default-avatar-user.jpg' })
    imagen: string;

    // CAMBIO: 'decimal' -> 'numeric'. Es el estándar de precisión en Postgres.
    @Column('numeric', { precision: 18, scale: 2, default: 0.00 })
    salary: number;

    // CAMBIO: 'datetime2' -> 'timestamp'.
    @CreateDateColumn({ type: 'timestamp' })
    fechaRegistro: Date;

    @OneToMany(() => Asignacion, (asignacion) => asignacion.usuario)
    asignaciones: Asignacion[];

    // ==========================================
    // Hooks e Integridad
    // ==========================================

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