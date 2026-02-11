// import { IsInt, IsString } from "class-validator";

// export class CreateAsignacioneDto {
//     @IsString()
//     fechaAsignacion: string;
//     @IsInt()
//     idUser: number;
//     @IsInt()
//     idProyecto: number;
// }


import { IsInt, IsString, IsISO8601, IsNotEmpty } from "class-validator";

export class CreateAsignacioneDto {
    
    @IsNotEmpty({ message: 'La fecha de asignación es obligatoria' })
    @IsISO8601({}, { message: 'La fecha debe tener un formato válido (ISO 8601, ej: 2026-02-10)' })
    fechaAsignacion: string;

    @IsInt({ message: 'El idUser debe ser un número entero' })
    idUser: number;

    @IsInt({ message: 'El idProyecto debe ser un número entero' })
    idProyecto: number;
}