import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/auth/user.repository';
import * as argon2 from 'argon2';
import { InjectRepository } from '@nestjs/typeorm';
import { SignInDto } from './dto/signin.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.entity';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
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

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  createUser(createUserDto: CreateUserDto): Promise<void> {
    return this.userRepository.createUser(createUserDto);
  }

  async getUser(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      loadEagerRelations: true,
    });

    return user;
  }
}
