import { InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { Banner } from './entity/banner.entity';

@EntityRepository(Banner)
export class BannerRepository extends Repository<Banner> {
  async getBanner(): Promise<Banner[]> {
    try {
      const banner = this.find();

      return banner;
    } catch {
      throw new InternalServerErrorException();
    }
  }
}
