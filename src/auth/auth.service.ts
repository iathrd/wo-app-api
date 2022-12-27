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
import { User } from './entity/user.entity';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { UserDetailRepository } from './user-detail.repository';
import { CreateDetailUserDto } from './dto/detail-user.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { VendorRepository } from './vendor.repository';
import { UserDetail } from './entity/user-detail.entity';
import { Vendor } from './entity/vendor.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(UserDetailRepository)
    private userDetailRepository: UserDetailRepository,
    @InjectRepository(VendorRepository)
    private vendorRepository: VendorRepository,
    private jwtService: JwtService,
    private cloudinary: CloudinaryService,
  ) {}

  async validateUser(signInDto: SignInDto): Promise<User | Vendor | null> {
    const { username, password } = signInDto;
    const user = await this.userRepository.findOne({ where: { username } });

    if (user) {
      const { password: userPassword } = user;
      const validatePassword = await argon2.verify(userPassword, password);

      if (validatePassword) {
        return user;
      }
    } else if (!user) {
      const vendor = await this.vendorRepository.findOne({
        where: { username },
      });
      if (vendor) {
        const { password: userPassword } = vendor;
        const validatePassword = await argon2.verify(userPassword, password);

        if (validatePassword) {
          return vendor;
        }

        return null;
      }
    }

    return null;
  }

  async login(user: any): Promise<{ access_token: string }> {
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

  async saveDetailUser(
    data: CreateDetailUserDto,
    user: User,
  ): Promise<UserDetail> {
    const userDetailData = this.userDetailRepository.create({
      ...data,
    });
    try {
      const userDetail = await this.userDetailRepository.save(userDetailData);
      await this.userRepository.save({
        ...user,
        userDetail: userDetail,
      });
      return userDetail;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async editDetailUser(data: CreateDetailUserDto): Promise<UserDetail> {
    const saveData = await this.userDetailRepository.save(data);
    return saveData;
  }

  async createUserDetail(
    createDetailUser: CreateDetailUserDto,
    user: User,
    file: Express.Multer.File,
  ): Promise<UserDetail> {
    //if user detail already exist in user parameter
    if (user.userDetail) {
      try {
        let data = await this.userDetailRepository.findOne({
          where: { id: user.userDetail.id },
        });

        //if file is not null
        if (file) {
          const dataImage = await this.cloudinary
            .uploadImage(file)
            .catch(() => {
              throw new BadRequestException('Invalid file type.');
            });
          data = { ...data, ...createDetailUser, picture: dataImage.url };
          return this.editDetailUser(data);
        }

        //if file is null
        data = { ...data, ...createDetailUser };
        return this.editDetailUser(data);
      } catch (error) {
        throw new InternalServerErrorException();
      }
    }

    //if file is not null
    if (file) {
      const data = await this.cloudinary.uploadImage(file).catch(() => {
        throw new BadRequestException('Invalid file type.');
      });

      //if image succes to upload to cloudinary
      if (data) {
        return this.saveDetailUser(
          { ...createDetailUser, picture: data.url },
          user,
        );
      } else {
        throw new BadRequestException();
      }
    }

    //if file is null
    return this.saveDetailUser(createDetailUser, user);
  }

  async createVendor(
    createVendorDto: CreateVendorDto,
    file: Express.Multer.File,
  ): Promise<void> {
    const dataImage = await this.cloudinary.uploadImage(file).catch(() => {
      throw new BadRequestException('Invalid file type.');
    });

    if (dataImage) {
      return this.vendorRepository.careteVendor({
        ...createVendorDto,
        ktpPicture: dataImage.url,
      });
    }

    throw new InternalServerErrorException();
  }
}
