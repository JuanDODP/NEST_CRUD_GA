import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseInterceptors, UploadedFile, } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-auth.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './entities/user.entity';
import { Auth, GetUser } from './decorators';
import { ValidRoles } from './interface/valid-roles';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileFilter, fileNamer } from './../utils/helpers'
import { ApiTags } from '@nestjs/swagger';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  // opcion de subir con imagen y sin imagen, para el caso de auth, no es necesario subir imagen, por lo que se deja sin imagen
  @UseInterceptors(FileInterceptor('imagen', {
    fileFilter,
    storage: diskStorage({
      destination: './static/users',
      filename: fileNamer
    })
  }))
  @Post('register')
  create(@Body() createAuthDto: CreateUserDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    return this.authService.create(createAuthDto, file);
  }
  @Auth(ValidRoles.ADMIN, ValidRoles.SUPER_USER)
  @Post('create_user')
  createUser(@Body() createAuthDto: CreateUserDto,
    @GetUser() user: User
  ) {
    return this.authService.createUser(createAuthDto, user);
  }
  @Post('login')
  login(@Body() loginAuthDto: LoginUserDto) {
    return this.authService.login(loginAuthDto);
  }
  @Get('users')
  findAll() {
    return this.authService.findAll()
  }
  @Get('users/:id')
  findOne(
    @Param('id', ParseIntPipe) id: number) {
    return this.authService.findOne(id);
  }
  @Patch('users/:id')
  @UseInterceptors(FileInterceptor('imagen', { // Usamos 'imagen' para coincidir con tu POST
    fileFilter,
    storage: diskStorage({
      destination: './static/users',
      filename: fileNamer
    })
  }))
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto
    , @UploadedFile() file?: Express.Multer.File
) {
    return this.authService.update(id, updateUserDto, file);
  }
  @Delete('users/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.authService.remove(id)
  }
  // checar status
  @Get('check-status')
  @Auth()
  checkAuthStatus(
    @GetUser() user: User
  ) {
    return this.authService.checkAuthStatus(user);
  }
  // ================================================

}
