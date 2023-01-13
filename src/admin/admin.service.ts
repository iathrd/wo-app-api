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
import { DetailPartnerRepository } from './detail-partner.repository';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
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
    @InjectRepository(DetailPartnerRepository)
    private detailPartnerRepository: DetailPartnerRepository,
    private clodinary: CloudinaryService,
  ) {}

  async getAllVendor() {
    const data = await this.vendorRepository.find();

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

  getBanner() {
    return this.bannerRepository.getBanner();
  }

  async updatePartner(updatePartnerDto: UpdatePartnerDto, id: string) {
    try {
      const detailData = this.detailPartnerRepository.create(updatePartnerDto);

      const detailPartner = await this.detailPartnerRepository.save(detailData);

      if (detailPartner) {
        const dataPartner = await this.vendorRepository.findOne({ id });

        const editData = await this.vendorRepository.save({
          ...dataPartner,
          detail: detailPartner,
        });

        return editData;
      }
    } catch {
      throw new InternalServerErrorException();
    }
  }
}
