import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './entities/user.entity';
import { JwtPayload } from './interface/jwt.interface.payload';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) { }

  async create(createAuthDto: CreateUserDto) {
    try {
      const { password, ...userData } = createAuthDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });

      await this.userRepository.save(user);


      return {
        ...user,
        token: await this.getJwtToken({ id: user.id }),
      };
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async login(loginAuthDto: LoginUserDto) {
    const { email, password } = loginAuthDto;


    const user = await this.userRepository.findOne({
      where: { email },
      select: { id: true, email: true, password: true, name: true, rol: true }
    });

    if (!user) {
      throw new UnauthorizedException('Credentials are not valid - email');
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Credentials are not valid - password');
    }

    // 4. Quitamos el password del objeto antes de retornar


    return {
      ...user,
      token: await this.getJwtToken({ id: user.id }),
    };
  }
  async findAll() {
    try {
      const usuarios = await this.userRepository.find()
      return {
        ok: true,
        usuarios
      }
    } catch (error) {
      this.handleDBErrors(error)
    }
  }
  async findOne(id: number) {
    const usuarios = await this.userRepository.findOne({
      where: { id },

    })
    if (!usuarios) {
      throw new NotFoundException(`user with id ${id} not found `)
    }
    return {
      ok: true,
      usuarios
    }
  }

  private async getJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(`El registro ya existe en la base de datos: ${error.detail}`);
    }

    console.error(error); // Usar console.error para logs de error
    throw new InternalServerErrorException('Error inesperado, revisar logs del servidor');
  }
}