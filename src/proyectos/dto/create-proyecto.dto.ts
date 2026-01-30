import { IsInt, IsString } from "class-validator";

export class CreateProyectoDto {
    @IsString()
    nombreProyecto: string;

   

    @IsString()
    fechaInicio: string;

    @IsString()
    fechaFin: string;
    @IsInt()
    idArea: number;
    
}
