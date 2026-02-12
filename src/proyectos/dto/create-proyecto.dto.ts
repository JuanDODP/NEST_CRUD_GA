// import { IsInt, IsString } from "class-validator";

// export class CreateProyectoDto {
//     @IsString()
//     nombreProyecto: string;



//     @IsString()
//     fechaInicio: string;

//     @IsString()
//     fechaFin: string;
//     @IsInt()
//     idArea: number;

// }


import { Type } from "class-transformer";
import { IsInt, IsString, IsISO8601, MinLength, IsNotEmpty, IsOptional, IsPositive } from "class-validator";

export class CreateProyectoDto {

    @IsString()
    @IsNotEmpty()
    @MinLength(3, { message: 'El nombre del proyecto debe tener al menos 3 caracteres' })
    nombreProyecto: string;

    @IsISO8601({}, { message: 'fechaInicio debe ser una fecha válida en formato ISO 8601 (AAAA-MM-DD)' })
    @IsNotEmpty()
    fechaInicio: string;

    @IsISO8601({}, { message: 'fechaFin debe ser una fecha válida en formato ISO 8601 (AAAA-MM-DD)' })
    @IsNotEmpty()
    fechaFin: string;


    @IsInt({ message: 'El idArea debe ser un número entero' })
    @IsNotEmpty()
    @IsPositive({ message: 'El idArea debe ser un número positivo' })
    @Type(() => Number) // Esto asegura que el valor se transforme a número antes de la validación
    idArea: number;
    @IsString()
    // @MinLength(1, { message: 'La imagen es requerida' })
    @IsOptional()
    imagen?: string;
}