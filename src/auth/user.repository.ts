import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entity/user.entity';
import * as argon2 from 'argon2';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Role } from 'src/roles/roles.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(createUserDto: CreateUserDto, role: Role): Promise<void> {
    const { password } = createUserDto;
    const hashedPassword = await argon2.hash(password);

    const user = this.create({
      ...createUserDto,
      role,
      password: hashedPassword,
    });

    try {
      await this.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already exist');
      } else if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Username already exist');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
