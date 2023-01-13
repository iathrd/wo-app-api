import { EntityRepository, Repository } from 'typeorm';
import { DetailPartner } from './entity/detail-partner.entity';

@EntityRepository(DetailPartner)
export class DetailPartnerRepository extends Repository<DetailPartner> {}
