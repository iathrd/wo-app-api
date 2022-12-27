import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/auth/user.repository';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './streategy/local.stategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './streategy/jwt.strategy';
import { UserDetailRepository } from './user-detail.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { VendorRepository } from './vendor.repository';

@Module({
  imports: [
    CloudinaryModule,
    HttpModule,
    ConfigModule,
    TypeOrmModule.forFeature([
      UserRepository,
      UserDetailRepository,
      VendorRepository,
    ]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: 3600,
        },
      }),
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
