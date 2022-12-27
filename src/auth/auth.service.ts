import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserRepository } from 'src/auth/user.repository';
import * as argon2 from 'argon2';
import { InjectRepository } from '@nestjs/typeorm';
import { SignInDto } from './dto/signin.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.entity';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { UserDetailRepository } from './user-detail.repository';
import { CreateDetailUser } from './dto/detail-user.dto';
import { UserDetail } from './user-detail.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(UserDetailRepository)
    private userDetailRepository: UserDetailRepository,
    private jwtService: JwtService,
    private cloudinary: CloudinaryService,
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

  async createUserDetail(
    createDetailUser: CreateDetailUser,
    user: User,
    file: Express.Multer.File,
  ): Promise<UserDetail> {
    const data = await this.cloudinary.uploadImage(file).catch(() => {
      throw new BadRequestException('Invalid file type.');
    });
    if (data) {
      const userDetail = this.userDetailRepository.create({
        ...createDetailUser,
        picture: data.url,
      });

      try {
        const insertUserDetail = await this.userDetailRepository.save(
          userDetail,
        );
        await this.userRepository.save({
          ...user,
          userDetail: insertUserDetail.id,
        });
        return insertUserDetail;
      } catch (error) {
        throw new InternalServerErrorException();
      }
    } else {
      throw new BadRequestException();
    }
  }
}
