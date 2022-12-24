import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CreateRoleDto } from './dto/create-role-dto';
import { Role } from './roles.entity';
import { RolesService } from './roles.service';

@Controller('roles')
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
