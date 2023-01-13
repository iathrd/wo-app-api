import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VendorRepository } from 'src/auth/vendor.repository';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { AssetRepository } from './asset.repository';
import { BannerRepository } from './banner.repository';
import { CreateBannerDto } from './dto/create-banner.dto';
import { Banner } from './entity/banner.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(VendorRepository)
    private vendorRepository: VendorRepository,
    @InjectRepository(AssetRepository)
    private assetRepository: AssetRepository,
    @InjectRepository(BannerRepository)
    private bannerRepository: BannerRepository,
    private clodinary: CloudinaryService,
  ) {}

  async getAllVendor() {
    const query = this.vendorRepository.createQueryBuilder('vendor');
    const data = await query
      .addSelect(['vendor.ktpPicture', 'vendor.bankName', 'vendor.bankNumber'])
      .getMany();

    return data;
  }

  async createBanner(
    file: Express.Multer.File,
    createBannerDto: CreateBannerDto,
  ): Promise<Banner> {
    try {
      const dataImage = await this.clodinary.uploadImage(file).catch(() => {
        throw new BadRequestException('Invalid file type');
      });

      const dataAsset = this.assetRepository.create({
        url: dataImage.url,
        publicId: dataImage.public_id,
        name: dataImage.original_filename,
      });

      const assetData = await this.assetRepository.save(dataAsset);

      const dataBanner = this.bannerRepository.create({
        ...createBannerDto,
        asset: assetData,
      });

      const bannerData = await this.bannerRepository.save(dataBanner);

      return bannerData;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
