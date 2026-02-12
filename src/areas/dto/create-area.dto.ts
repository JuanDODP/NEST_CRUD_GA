import { IsOptional, IsString, MinLength } from "class-validator";


export class CreateAreaDto {
   @IsString()
   @MinLength(1, { message: 'El nombre es requerido' })
   nombre: string;

   @IsString()
   @MinLength(1, { message: 'La descripción es requerida' })
   description: string;

   @IsString()
   // @MinLength(1, { message: 'La imagen es requerida' })
   @IsOptional()
   imagen?: string;

}
