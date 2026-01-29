import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
// import { JwtPayload } from '../interface/jwt.interface.payload';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get<string>('JWT_SECRET') as string, // Asegúrate de que esto sea un string.
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

   async validate(payload: any): Promise<any> {
     const { id } = payload;
     const user = await this.userRepository.findOneBy({ id });
     if (!user) {
       throw new UnauthorizedException('Invalid token - user does not exist');
     }
     if (!user.isActive) {
       throw new UnauthorizedException('User is inactive');
     }
     console.log({user},'EL USER EN JWT STRATEGY')
     return user;
   }
}
