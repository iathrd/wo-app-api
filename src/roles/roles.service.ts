import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRoleDto } from './dto/create-role-dto';
import { Role } from './roles.entity';
import { RoleRepository } from './roles.repository';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RoleRepository)
    private roleRepository: RoleRepository,
  ) {}

  createRole(createRoleDto: CreateRoleDto): Promise<Role> {
    return this.roleRepository.createRoles(createRoleDto);
  }

  async deleteRole(id: number) {
    const result = await this.roleRepository.delete({ id });

    if (result.affected === 0) {
      throw new NotFoundException('id doest exist');
    }
  }
}
