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
import { EditVendorDto } from './dto/edit-vendor-dto';
import { ChangeDataDto } from './dto/change-data.dto';
import { generateNumber } from 'src/common/helpers/number.helper';
import { SendinblueService } from 'src/sendinblue/sendinblue.service';
import { VerifyEmailDto } from './dto/verification-email.dto';
import { RoleRepository } from 'src/roles/roles.repository';
import { RoleEnum } from './dto/role.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(UserDetailRepository)
    private userDetailRepository: UserDetailRepository,
    @InjectRepository(VendorRepository)
    private vendorRepository: VendorRepository,
    @InjectRepository(RoleRepository)
    private roleRepository: RoleRepository,
    private jwtService: JwtService,
    private sendinBlueService: SendinblueService,
    private cloudinary: CloudinaryService,
  ) {}

  async findUser(username: string): Promise<User | Vendor> {
    try {
      const user = await this.userRepository.findOne({ username });

      if (!user) {
        const vendor = await this.vendorRepository.findOne({ username });
        if (vendor) {
          return vendor;
        }
        throw new InternalServerErrorException();
      }

      return user;
    } catch {
      throw new InternalServerErrorException();
    }
  }

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

  async createUser(createUserDto: CreateUserDto): Promise<void> {
    const role = await this.roleRepository.findOne({ id: createUserDto.role });

    if (role) {
      return this.userRepository.createUser(createUserDto, role);
    }

    throw new InternalServerErrorException();
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
    const role = await this.roleRepository.findOne({
      id: createVendorDto.role,
    });

    if (role) {
      const dataImage = await this.cloudinary.uploadImage(file).catch(() => {
        throw new BadRequestException('Invalid file type.');
      });

      if (dataImage) {
        return this.vendorRepository.careteVendor(
          {
            ...createVendorDto,
            ktpPicture: dataImage.url,
          },
          role,
        );
      }
    }

    throw new InternalServerErrorException();
  }

  async editVendor(
    editVendorDto: EditVendorDto,
    vendor: Vendor,
  ): Promise<Vendor> {
    try {
      const findVendor = await this.vendorRepository.findOne({
        username: vendor.username,
      });

      const data = { ...findVendor, ...editVendorDto };
      await this.vendorRepository.save(data);

      return data;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async ressetData(changeDataDto: ChangeDataDto) {
    const { username } = changeDataDto;
    try {
      const user = await this.findUser(username);
      if (user) {
        const generatedNumber = generateNumber();

        const response = await this.sendinBlueService.sendEmail({
          sender: {
            name: 'Dream Weding',
            email: 'dreamweding3@gmail.com',
          },
          to: [
            {
              email: user.email,
              name: user.username,
            },
          ],
          subject: 'Resset Password',
          htmlContent: `<html><head></head><body>
          <h5>Hello ${user.username}  ,</h5>
          <h5> There was a request to change your password!</h5>
          <h5>If you did not make this request then please ignore this email.</h5>
          Your verification number is <b><h1>${generatedNumber}</h1></b></p></body></html>`,
        });

        if (response) {
          const hashedVerification = await argon2.hash(generatedNumber);

          return {
            verificationCode: hashedVerification,
            username: user.username,
          };
        }

        throw new BadRequestException();
      }
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async verifyEmail(
    verifyEmailDto: VerifyEmailDto,
  ): Promise<{ token: string }> {
    try {
      const { username, verificationCode, code } = verifyEmailDto;

      const valid = await argon2.verify(verificationCode, code);

      if (valid) {
        return {
          token: this.jwtService.sign({ username }, { expiresIn: '5m' }),
        };
      }

      throw new BadRequestException('Invalid code!');
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async ressetPassword(password: string, user: User | Vendor): Promise<void> {
    try {
      const hashedPassword = await argon2.hash(password);

      if (user.role.name === RoleEnum.Partner) {
        await this.vendorRepository.save({ ...user, password: hashedPassword });
      } else if (user.role.name === RoleEnum.User) {
        await this.userRepository.save({ ...user, password: hashedPassword });
      }
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
