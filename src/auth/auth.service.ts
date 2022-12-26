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
import { catchError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import * as FormData from 'form-data';
import { UserDetail } from './user-detail.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(UserDetailRepository)
    private userDetailRepository: UserDetailRepository,
    private jwtService: JwtService,
    private readonly httpService: HttpService,
    private configService: ConfigService,
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
    const formData = new FormData();
    formData.append('image', file.buffer.toString('base64'));
    const { data } = await firstValueFrom(
      this.httpService
        .post(
          `https://api.imgbb.com/1/upload?expiration=600&key=${this.configService.get(
            'IMGBB_KEY',
          )}`,
          formData,
        )
        .pipe(
          catchError(() => {
            throw new InternalServerErrorException('Image failed to uploaded!');
          }),
        ),
    );
    if (data) {
      const userDetail = this.userDetailRepository.create({
        ...createDetailUser,
        picture: data.data.url,
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
