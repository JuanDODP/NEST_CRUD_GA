import { IsEmail, IsString, Matches, MaxLength, MinLength, IsArray, IsOptional } from "class-validator";

export class CreateUserDto {

    @IsString()
    @MinLength(1, { message: 'El nombre es requerido' })
    name: string; // Mapea a 'Nombre'

    @IsEmail({}, { message: 'El formato del correo no es válido' })
    email: string; // Mapea a 'Correo'

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'La contraseña debe tener una letra mayúscula, una minúscula y un número'
    })
    password: string; // Mapea a 'Contrasena'

    // Estos campos son opcionales en el DTO porque 
    // tu entidad ya tiene valores por defecto (@Column default: ...)
    // @IsOptional()
    // @IsArray()
    // @IsString({ each: true })
    // rol?: string[];

    // @IsOptional()
    // isActive?: boolean;
}