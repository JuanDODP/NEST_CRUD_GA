import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-auth.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './entities/user.entity';
import { Auth, GetUser } from './decorators';
import { ValidRoles } from './interface/valid-roles';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileFilter, fileNamer } from './../utils/helpers';
import { ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  @ApiOperation({ summary: 'Registro de nuevo usuario con imagen opcional' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente', type: User })
  @ApiResponse({ status: 400, description: 'Datos inválidos o el correo ya existe' })
  @UseInterceptors(FileInterceptor('imagen', {
    fileFilter,
    storage: diskStorage({
      destination: './static/users',
      filename: fileNamer
    })
  }))
  create(
    @Body() createAuthDto: CreateUserDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    return this.authService.create(createAuthDto, file);
  }

  @Post('create_user')
  @Auth(ValidRoles.ADMIN, ValidRoles.SUPER_USER)
  @ApiOperation({ summary: 'Crear usuario (Solo ADMIN o SUPER_USER)' })
  @ApiResponse({ status: 201, description: 'Usuario creado por administrador', type: User })
  @ApiResponse({ status: 403, description: 'Prohibido: Falta de permisos' })
  createUser(
    @Body() createAuthDto: CreateUserDto,
    @GetUser() user: User
  ) {
    return this.authService.createUser(createAuthDto, user);
  }

  @Post('login')
  @ApiOperation({ summary: 'Inicio de sesión' })
  @ApiResponse({ status: 200, description: 'Login exitoso, devuelve el JWT y datos del usuario' })
  @ApiResponse({ status: 401, description: 'Credenciales no válidas' })
  login(@Body() loginAuthDto: LoginUserDto) {
    return this.authService.login(loginAuthDto);
  }

  @Get('users')
  @ApiOperation({ summary: 'Obtener lista de todos los usuarios registrados' })
  @ApiResponse({ status: 200, type: [User] })
  findAll() {
    return this.authService.findAll();
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Obtener un usuario por su ID' })
  @ApiResponse({ status: 200, type: User })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.authService.findOne(id);
  }

  @Patch('users/:id')
  @ApiOperation({ summary: 'Actualizar datos de usuario e imagen de perfil' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, description: 'Usuario actualizado correctamente', type: User })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })

  @UseInterceptors(FileInterceptor('imagen', {
    fileFilter,
    storage: diskStorage({
      destination: './static/users',
      filename: fileNamer
    })
  }))
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    return this.authService.update(id, updateUserDto, file);
  }

  @Delete('users/:id')
  @ApiOperation({ summary: 'Eliminar o desactivar un usuario' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado correctamente' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })

  remove(@Param('id', ParseIntPipe) id: number) {
    return this.authService.remove(id);
  }

  @Get('check-status')
  @Auth()
  @ApiOperation({ summary: 'Verificar el estado del token y renovarlo' })
  @ApiResponse({ status: 200, description: 'Token válido, devuelve nueva información de sesión' })
  @ApiResponse({ status: 401, description: 'Token expirado o inválido' })
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }
}