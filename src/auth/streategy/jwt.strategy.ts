import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/auth/user.repository';
import { User } from '../entity/user.entity';
import { ConfigService } from '@nestjs/config';
import { VendorRepository } from '../vendor.repository';
import { Vendor } from '../entity/vendor.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(VendorRepository)
    private vendorRepository: VendorRepository,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any): Promise<User | Vendor> {
    const { username } = payload;
    const user: User = await this.userRepository.findOne({ username });

    if (!user) {
      const vendor = await this.vendorRepository.findOne({ username });
      if (vendor) {
        return vendor;
      }
      throw new UnauthorizedException();
    }

    return user;
  }
}
