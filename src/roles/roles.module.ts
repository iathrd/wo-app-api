import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesController } from './roles.controller';
import { RoleRepository } from './roles.repository';
import { RolesService } from './roles.service';

@Module({
  imports: [TypeOrmModule.forFeature([RoleRepository])],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
