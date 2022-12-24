import { SetMetadata } from '@nestjs/common';
import { RoleEnum } from './dto/role.enum';

export const HasRoles = (...roles: RoleEnum[]) => SetMetadata('roles', roles);
