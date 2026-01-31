import { IsInt, IsString } from "class-validator";

export class CreateAsignacioneDto {
    @IsString()
    fechaAsignacion: string;
    @IsInt()
    idUser: number;
    @IsInt()
    idProyecto: number;
}
