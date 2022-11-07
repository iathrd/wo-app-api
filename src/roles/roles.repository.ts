import { Role } from './roles.entity';
import { CreateRoleDto } from './dto/create-role-dto';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Role)
export class RoleRepository extends Repository<Role> {
  async createRoles(createRoleDto: CreateRoleDto): Promise<Role> {
    const role = this.create(createRoleDto);

    await this.save(role);

    return role;
  }
}
