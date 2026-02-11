// import { IsEmail, IsString, Matches, MaxLength, MinLength, IsArray, IsOptional } from "class-validator";

// export class CreateUserDto {

//     @IsString()
//     @MinLength(1, { message: 'El nombre es requerido' })
//     name: string; // Mapea a 'Nombre'

//     @IsEmail({}, { message: 'El formato del correo no es válido' })
//     email: string; // Mapea a 'Correo'

//     @IsString()
//     @MinLength(6)
//     @MaxLength(50)
//     @Matches(
//         /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
//         message: 'La contraseña debe tener una letra mayúscula, una minúscula y un número'
//     })
//     password: string; // Mapea a 'Contrasena'

//     // Estos campos son opcionales en el DTO porque 
//     // tu entidad ya tiene valores por defecto (@Column default: ...)
//     // @IsOptional()
//     // @IsArray()
//     // @IsString({ each: true })
//     // rol?: string[];

//     // @IsOptional()
//     // isActive?: boolean;
// }

import { IsEmail, IsString, Matches, MaxLength, MinLength, IsArray, IsOptional, IsBoolean } from "class-validator";

export class CreateUserDto {

    @IsString()
    @MinLength(1, { message: 'El nombre es requerido' })
    name: string;

    @IsEmail({}, { message: 'El formato del correo no es válido' })
    email: string;

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'La contraseña debe tener una letra mayúscula, una minúscula y un número'
    })
    password: string;

    // Reactivamos el rol para que el DTO sea capaz de recibirlo
    @IsOptional()
    @IsArray({ message: 'El rol debe ser un arreglo de strings' })
    @IsString({ each: true, message: 'Cada rol debe ser un texto' })
    rol?: string[];

    @IsOptional()
    @IsBoolean({ message: 'isActive debe ser un valor booleano' })
    isActive?: boolean;
}