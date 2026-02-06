import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-auth.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './entities/user.entity';
import { Auth, GetUser } from './decorators';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  create(@Body() createAuthDto: CreateUserDto) {
    return this.authService.create(createAuthDto);
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
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.authService.update(id, updateUserDto)
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
    return this.authService.checkAuthStatus( user );
  }
// ================================================

}
