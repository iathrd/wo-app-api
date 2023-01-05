import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendorRepository } from 'src/auth/vendor.repository';

@Module({
  imports: [TypeOrmModule.forFeature([VendorRepository])],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
