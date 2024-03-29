import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendorRepository } from 'src/auth/vendor.repository';
import { AssetRepository } from './asset.repository';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { BannerRepository } from './banner.repository';
import { DetailPartnerRepository } from './detail-partner.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VendorRepository,
      AssetRepository,
      BannerRepository,
      DetailPartnerRepository,
    ]),
    CloudinaryModule,
  ],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
