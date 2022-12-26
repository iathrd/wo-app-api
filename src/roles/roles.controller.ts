import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RoleEnum } from 'src/auth/dto/role.enum';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { HasRoles } from 'src/auth/roles.decorator';
import { CreateRoleDto } from './dto/create-role-dto';
import { Role } from './roles.entity';
import { RolesService } from './roles.service';

@Controller('roles')
@HasRoles(RoleEnum.Admin)
@UseGuards(JwtAuthGuard)
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @Post()
  createRole(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
    return this.rolesService.createRole(createRoleDto);
  }

  @Delete(':id')
  deleteRole(@Param('id') id: number): Promise<void> {
    return this.rolesService.deleteRole(id);
  }

  @Get(':id')
  findRole(@Param('id') id: number): Promise<Role> {
    return this.rolesService.findRole(id);
  }
}
