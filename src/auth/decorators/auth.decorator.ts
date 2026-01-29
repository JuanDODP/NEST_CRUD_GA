        import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ValidRoles } from '../../auth/interface/valid-roles'; 
import { RoleProtected } from './role-protected.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserRolGuard } from '../use-rol/use-rol.guard';

export function Auth(...roles: ValidRoles[]) {
    return applyDecorators(
      RoleProtected(...roles),
     UseGuards(AuthGuard(), UserRolGuard),
  );
}