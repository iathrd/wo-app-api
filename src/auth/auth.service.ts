import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/users/user.repository';
import * as argon2 from 'argon2';
import { User } from 'src/users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SignInDto } from './dto/signin.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async validateUser(signInDto: SignInDto): Promise<User | null> {
    const { username, password } = signInDto;
    const user = await this.userRepository.findOne({ where: { username } });

    if (user) {
      const { password: userPassword } = user;
      const validatePassword = await argon2.verify(userPassword, password);

      if (validatePassword) {
        return user;
      }
    }

    return null;
  }
}
