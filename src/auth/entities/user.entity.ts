import { Asignacion } from "src/asignaciones/entities/asignacione.entity";
import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    OneToMany,
} from "typeorm";

@Entity('users')
export class User {

    @PrimaryGeneratedColumn('increment')
    id: number; // IdUsuario (PK)

    @Column('text')
    name: string; // Nombre

    @Column('text', { unique: true })
    email: string; // Correo
    @Column('text')
    password: string; // Contrasena
    // si esta activo o no
     @Column('boolean', { default: true })
    isActive: boolean;
    @Column('text', { array: true, default: ['user'] })
    rol: string[]; // Rol

    @CreateDateColumn({ type: 'timestamp' })
    fechaRegistro: Date; // FechaRegistro

    // ==========================================
    // Hooks para mantener la integridad del correo
    // ==========================================

    // Un usuario puede estar en muchas asignaciones (muchos proyectos)
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
}