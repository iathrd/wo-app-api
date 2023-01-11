import { EntityRepository, Repository } from 'typeorm';
import { Banner } from './entity/banner.entity';

@EntityRepository(Banner)
export class BannerRepository extends Repository<Banner> {}
