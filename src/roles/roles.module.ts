import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { RolesController } from './roles.controller';
import { RoleRepository } from './roles.repository';
import { RolesService } from './roles.service';

@Module({
  imports: [TypeOrmModule.forFeature([RoleRepository]), AuthModule],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
