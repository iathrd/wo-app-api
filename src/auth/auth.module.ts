import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/users/user.repository';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.stategy';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository]), PassportModule],
  providers: [AuthService, LocalStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
