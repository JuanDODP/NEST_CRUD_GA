// import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { JwtService } from '@nestjs/jwt';
// import * as bcrypt from 'bcrypt';

// import { CreateUserDto } from './dto/create-user.dto';
// import { LoginUserDto } from './dto/login-user.dto';
// import { User } from './entities/user.entity';
// import { JwtPayload } from './interface/jwt.interface.payload';
// import { UpdateUserDto } from './dto/update-auth.dto';

// @Injectable()
// export class AuthService {
//   constructor(
//     @InjectRepository(User)
//     private readonly userRepository: Repository<User>,
//     private readonly jwtService: JwtService,
//   ) { }

//   async create(createAuthDto: CreateUserDto) {
//     try {
//       const { password, ...userData } = createAuthDto;

//       const user = this.userRepository.create({
//         ...userData,
//         password: bcrypt.hashSync(password, 10),
//       });
//       // verificar el rol
//       await this.userRepository.save(user);

//         const { password: _, ...userRest } = user; // Desestructuramos para eliminar el password de la respuesta
//       return {
//        user: userRest,
//         token: await this.getJwtToken({ id: user.id }),
//       };
//     } catch (error) {
//       this.handleDBErrors(error);
//     }
//   }

//   async login(loginAuthDto: LoginUserDto) {
//     const { email, password, ...userData } = loginAuthDto;


//     const user = await this.userRepository.findOne({
//       where: { email },
//       select: { id: true, email: true, password: true, name: true, rol: true,  isActive:true}
//     });

//     if (!user) {
//       throw new UnauthorizedException('Credentials are not valid - email');
//     }
//     if (!bcrypt.compareSync(password, user.password)) {
//       throw new UnauthorizedException('Credentials are not valid - password');
//     }
//     if (!user.isActive) {
//       throw new UnauthorizedException('User is inactive, talk with an admin');
//     }

//     // 4. Quitamos el password del objeto antes de retornar
//     const { password: _, ...userRest } = user; // Desestructuramos para eliminar el password de la respuesta
//     return {
//       ...userRest,
//       token: await this.getJwtToken({ id: user.id }),
//     };
//   }
//   async findAll() {
//     try {
//       const usuarios = await this.userRepository.find({
//         where: { isActive: true },
//         select: { id: true, email: true, name: true, rol: true,}
//       })
//       return {
//         ok: true,
//         usuarios
//       }
//     } catch (error) {
//       this.handleDBErrors(error)
//     }
//   }
//   async findOne(id: number) {
//     const usuarios = await this.userRepository.findOne({
//       where: { id, },
//       select: { id: true, email: true, name: true, rol: true, isActive:true }

//     })
//     if (!usuarios) {
//       throw new NotFoundException(`user with id ${id} not found `)
//     }
//     if (!usuarios.isActive) {
//     throw new UnauthorizedException(`User with id ${id} is inactive`);
//   }

//     return {
//       ok: true,
//       usuarios
//     }
//   }

//   async update(id: number, updateUserDto: UpdateUserDto) {
//     const { usuarios } = await this.findOne(id)
//     if (!usuarios) {
//       throw new NotFoundException(`user with id ${id} not found`)
//     }
//     // paso a paso de como editar un usuario 
//     try {
//       // 2. Si hay password en el DTO, lo encriptamos
//       if (updateUserDto.password) {
//         updateUserDto.password = bcrypt.hashSync(updateUserDto.password, 10);
//       }

//       // 3. MEZCLAMOS los cambios manualmente sobre la entidad encontrada
//       // Esto garantiza que conservamos la instancia de la clase 'User'
//       const userToUpdate = this.userRepository.merge(usuarios, updateUserDto);

//       // 4. Guardamos la entidad mezclada
//       const updatedUser = await this.userRepository.save(userToUpdate);

//       // 5. Limpiamos la respuesta para no enviar el password
//       const { password, ...userRest } = updatedUser;

//       return {
//         ok: true,
//         usuario: userRest,
//       };

//     } catch (error) {
//       this.handleDBErrors(error);
//     }
//   }

//   //   async update(id: number, updateUserDto: UpdateUserDto) {
//   //   // 1. IMPORTANTE: Extraer la entidad del objeto que retorna tu findOne
//   //   // Tu findOne retorna { ok: true, usuarios: User }
//   //   const { usuarios } = await this.findOne(id); 

//   //   try {
//   //     // 2. Encriptar contraseña si viene en el DTO
//   //     if (updateUserDto.password) {
//   //       updateUserDto.password = bcrypt.hashSync(updateUserDto.password, 10);
//   //     }

//   //     // 3. Preload busca el ID y mezcla los cambios del DTO
//   //     const updatedUser = await this.userRepository.preload({
//   //       id: id,
//   //       ...updateUserDto,
//   //     });

//   //     // Validamos que preload realmente haya cargado algo antes de guardar
//   //     if (!updatedUser) {
//   //       throw new NotFoundException(`User with id ${id} not found for update`);
//   //     }

//   //     // 4. Guardar la entidad
//   //     await this.userRepository.save(updatedUser);

//   //     // 5. Limpiar la respuesta (usando desestructuración para evitar errores de TS)
//   //     const { password, ...userRest } = updatedUser;

//   //     return {
//   //       ok: true,
//   //       usuario: userRest,
//   //     };
//   //   } catch (error) {
//   //     this.handleDBErrors(error);
//   //   }
//   // }
//   async remove(id: number) {
//     const { usuarios } = await this.findOne(id)
//     if (!usuarios) {
//       throw new NotFoundException(`user with id ${id} not Found`)
//     }
//     usuarios.isActive = false
//     await this.userRepository.save(usuarios)
//     return {
//       ok: true,
//       message: `user with id ${id} has been remove`
//     }



//   }
//   private async getJwtToken(payload: JwtPayload) {
//     return this.jwtService.sign(payload);
//   }

// private handleDBErrors(error: any): never {
//   // SQL Server usa códigos numéricos para errores de restricción única
//   if (error.number === 2627 || error.number === 2601) {
//     throw new BadRequestException(`El registro ya existe: ${error.message}`);
//   }

//   console.error(error);
//   throw new InternalServerErrorException('Error inesperado, revisar logs');
// }
//   // checar status
//     async checkAuthStatus( user: User ){

//     return {
//       user: user,
//      token: await this.getJwtToken({ id: user.id }),
//     };

//   }

//   // ========================
// }

import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './entities/user.entity';
import { JwtPayload } from './interface/jwt.interface.payload';
import { UpdateUserDto } from './dto/update-auth.dto';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import { join } from 'path';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,

  ) { }

  async create(createAuthDto: CreateUserDto, file?: Express.Multer.File) {
    try {
      const { password, rol, ...userData } = createAuthDto;

      const user = this.userRepository.create({
        ...userData,
        // SQL Server: Convertimos el arreglo de roles a string separado por comas
        rol: Array.isArray(rol) ? rol.join(',') : rol,
        password: bcrypt.hashSync(password, 10),
        imagen: file ? file.filename : 'default-avatar-user.jpg' // Si no se sube imagen, asignamos una por defecto
      });

      await this.userRepository.save(user);

      const { password: _, ...userRest } = user;
      return {
        user: { ...userRest, imagen: `${this.configService.get('HOST_API')}/files/users/${userRest.imagen}` },
        token: await this.getJwtToken({ id: user.id }),
      };
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  // Crear usuario por otro usuario administrador
  async createUser(createAuthDto: CreateUserDto, user: User) {
    try {
      const { password, rol, ...userData } = createAuthDto;

      const newUser = this.userRepository.create({
        ...userData,
        rol: Array.isArray(rol) ? rol.join(',') : rol,
        password: bcrypt.hashSync(password, 10),
      });

      await this.userRepository.save(newUser);

      const { password: _, ...userRest } = newUser;
      return {
        user: userRest,
        token: await this.getJwtToken({ id: newUser.id }),
      };
    } catch (error) {
      this.handleDBErrors(error);
    }
  }
  // ======================================================================================================================================

  async login(loginAuthDto: LoginUserDto) {
    const { email, password } = loginAuthDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { id: true, email: true, password: true, name: true, rol: true, isActive: true }
    });

    if (!user) {
      throw new UnauthorizedException('Credentials are not valid - email');
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Credentials are not valid - password');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User is inactive, talk with an admin');
    }

    const { password: _, ...userRest } = user;
    return {
      ...userRest,
      token: await this.getJwtToken({ id: user.id }),
    };
  }

  async findAll() {
    try {
      const usuarios = await this.userRepository.find({
        where: { isActive: true },
        select: { id: true, email: true, name: true, rol: true, imagen: true }
      });
      return {
        ok: true,
        usuarios
      };
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async findOne(id: number) {
    const usuario = await this.userRepository.findOne({
      where: { id },
      select: { id: true, email: true, name: true, rol: true, isActive: true }
    });

    if (!usuario) {
      throw new NotFoundException(`user with id ${id} not found `);
    }

    if (!usuario.isActive) {
      throw new UnauthorizedException(`User with id ${id} is inactive`);
    }

    return {
      ok: true,
      usuarios: usuario
    };
  }
async update(id: number, updateUserDto: UpdateUserDto, file?: Express.Multer.File) {
  const { usuarios } = await this.findOne(id);

  try {
    if (updateUserDto.password) {
      updateUserDto.password = bcrypt.hashSync(updateUserDto.password, 10);
    }

    const { rol, ...restOfDto } = updateUserDto;

    const userDataToUpdate = {
      ...restOfDto,
      rol: (rol && Array.isArray(rol)) ? rol.join(',') : usuarios.rol
    };

    const userToUpdate = this.userRepository.merge(usuarios, userDataToUpdate as any);

    // LOGICA DE IMAGEN
    if (file) {
      // 1. Si el usuario ya tenía una imagen, la borramos de la carpeta
      if (usuarios.imagen && usuarios.imagen !== 'default-user.png') {
        const path = join(__dirname, '../../static/users', usuarios.imagen);
        console.log('EL PATH DE LA IMAGEN ES:', path);
        if (fs.existsSync(path)) {
          fs.unlinkSync(path); // Borra el archivo físicamente
        }
      }

      // 2. Guardamos SOLO el nombre del archivo (no la URL completa)
      userToUpdate.imagen = file.filename; 
    }

    const updatedUser = await this.userRepository.save(userToUpdate);
    const { password, ...userRest } = updatedUser;

    return {
      ok: true,
      usuario: {
        ...userRest,
        // Construimos la URL solo para la respuesta, no para la DB

        imagen: file ? `${this.configService.get('HOST_API')}/files/users/${updatedUser.imagen}` : `${this.configService.get('HOST_API')}/files/users/${usuarios.imagen}`
      },
    };

  } catch (error) {
    this.handleDBErrors(error);
  }
}
  async remove(id: number) {
    const { usuarios } = await this.findOne(id);

    usuarios.isActive = false;
    await this.userRepository.save(usuarios);

    return {
      ok: true,
      message: `user with id ${id} has been removed`
    };
  }

  private async getJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  private handleDBErrors(error: any): never {
    // SQL Server usa códigos numéricos: 2627 (PK/Unique) y 2601 (Index)
    if (error.number === 2627 || error.number === 2601) {
      throw new BadRequestException(`El registro ya existe: ${error.message}`);
    }

    console.error(error);
    throw new InternalServerErrorException('Error inesperado, revisar logs');
  }

  async checkAuthStatus(user: User) {
    const { password: _, ...userRest } = user;
    return {
      user: userRest,
      token: await this.getJwtToken({ id: user.id }),
    };
  }
}