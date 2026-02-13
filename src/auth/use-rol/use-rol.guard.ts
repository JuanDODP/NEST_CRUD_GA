// other guard 
// import { Reflector } from '@nestjs/core';
// import { CanActivate, ExecutionContext, Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
// import { Observable } from 'rxjs';
// import { User } from '../entities/user.entity'; 
// import { META_ROLES } from '../decorators';

// @Injectable()
// export class UserRolGuard implements CanActivate {
  
//   constructor(
//     private readonly reflector: Reflector
//   ) {}

//   canActivate(
//     context: ExecutionContext,
//   ): boolean | Promise<boolean> | Observable<boolean> {
    
//     const validRoles: string[] = this.reflector.get( META_ROLES , context.getHandler() )

//     if ( !validRoles ) return true;
//     if ( validRoles.length === 0 ) return true;
    
//     const req = context.switchToHttp().getRequest();
//     const user = req.user as User;

//     if ( !user ) 
//       throw new BadRequestException('User not found');
    
//     for (const role of user.rol ) {
//       if ( validRoles.includes( role ) ) {
//         return true;
//       }
//     }
    
//     throw new ForbiddenException(
//       `User ${ user.name} need a valid role: [${ validRoles }]`
//     );
//   }
// }

import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from '../entities/user.entity'; 
import { META_ROLES } from '../decorators';

@Injectable()
export class UserRolGuard implements CanActivate {
  
  constructor(
    private readonly reflector: Reflector
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    
    const validRoles: string[] = this.reflector.get( META_ROLES , context.getHandler() )

    if ( !validRoles ) return true;
    if ( validRoles.length === 0 ) return true;
    
    const req = context.switchToHttp().getRequest();
    const user = req.user as User;

    if ( !user ) 
      throw new BadRequestException('User not found');
      const rolesArray = typeof user.rol === 'string' 
    ? user.rol.split(',').map(r => r.trim().toLowerCase()) 
    : user.rol;
    for (const role of rolesArray ) {
      if ( validRoles.includes( role ) ) {
        return true;
      }
    }
    
    throw new ForbiddenException(
      `User ${ user.name} need a valid role: [${ validRoles }]`
    );
  }
}