import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity('')
export class Area {
     @PrimaryGeneratedColumn('increment')
    id: number;
    @Column( )
    nombre: string;
    @Column()
    description:string
}
